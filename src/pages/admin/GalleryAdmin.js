import React, { useState, useEffect, useCallback } from "react";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Box, Button, TextField, Grid, Card, CardMedia, CardContent,
  Typography, CircularProgress, Paper, FormControl,
  InputLabel, Select, MenuItem,
  Snackbar, Alert, IconButton
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";

const BASE_URL = "http://localhost:5000";

// ✅ GALLERY SECTIONS (NOT PRODUCTS)
const GALLERY_SECTIONS = [
  { value: "client", label: "Client Transformations" },
  { value: "wig", label: "Wig & Hairstyling" },
  { value: "bridal", label: "Bridal" },
  { value: "makeup", label: "Makeup" },
  { value: "behind_scenes", label: "Behind the Scenes" },
  { value: "other", label: "Other" },
];

export default function GalleryAdmin() {
  const adminKey = localStorage.getItem("adminKey");

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [section, setSection] = useState("client");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    severity: "success"
  });

  const toast = (msg, severity = "success") => {
    setSnackbar({ open: true, msg, severity });
  };

  // ✅ FETCH IMAGES
  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/gallery`);
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      toast("Failed to load gallery", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // ✅ UPLOAD IMAGES
  const uploadImages = async () => {
    if (!adminKey) {
      toast("Login required", "warning");
      window.location.href = "/admin/login";
      return;
    }

    if (!files.length) {
      toast("Select at least one image", "warning");
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("section", section);

        const res = await fetch(`${BASE_URL}/api/gallery/upload`, {
          method: "POST",
          headers: {
            "x-admin-key": adminKey // ✅ CORRECT AUTH HEADER
          },
          body: formData
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminKey");
          toast("Session expired. Login again.", "warning");
          window.location.href = "/admin/login";
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
      }

      toast("Images uploaded successfully ✅");
      setFiles([]);
      fetchImages();

    } catch (err) {
      toast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ✅ DELETE IMAGE
  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey
        }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminKey");
        window.location.href = "/admin/login";
        return;
      }

      setImages(prev => prev.filter(img => img._id !== id));
      toast("Deleted");

    } catch {
      toast("Delete failed", "error");
    }
  };

  // ✅ FILTER
  const filtered = images.filter(img =>
    (img.caption || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Box p={3}>

      {/* Upload */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Upload Images</Typography>

        {/* ✅ FIXED PROP */}
        <UploadDropzone onChange={setFiles} multiple />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Section</InputLabel>
          <Select
            value={section}
            label="Section"
            onChange={(e) => setSection(e.target.value)}
          >
            {GALLERY_SECTIONS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={uploadImages}
          sx={{ mt: 3 }}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={20} /> : "Upload"}
        </Button>
      </Paper>

      {/* Search */}
      <TextField
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />
        }}
        sx={{ mb: 3 }}
        fullWidth
      />

      {/* Grid */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {filtered.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    img.url?.startsWith("http")
                      ? img.url
                      : `${BASE_URL}${img.url}`
                  }
                />
                <CardContent>
                  <Typography>
                    {img.caption || "No caption"}
                  </Typography>

                  <IconButton onClick={() => deleteImage(img._id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((s) => ({ ...s, open: false }))
        }
      >
        <Alert severity={snackbar.severity}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}