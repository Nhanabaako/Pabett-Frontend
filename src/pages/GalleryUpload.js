// src/pages/GalleryAdmin.js
import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  CardMedia,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : process.env.REACT_APP_API_URL || "https://pabett.onrender.com";

const API_URL = `${API_BASE}/api/gallery`;

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [section, setSection] = useState("client");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const adminKey = localStorage.getItem("adminKey");

  // ✅ Redirect non-admins
  useEffect(() => {
    if (!adminKey) {
      navigate("/admin/login");
    } else {
      fetchImages();
    }
  }, [adminKey, navigate]);

  // ✅ Fetch gallery images
  const fetchImages = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload image
  const handleUpload = async () => {
    if (!file) return showSnackbar("Please select a file", "warning");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("altText", altText);
    formData.append("caption", caption);
    formData.append("section", section);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showSnackbar("✅ Image uploaded successfully!", "success");
        setFile(null);
        setAltText("");
        setCaption("");
        fetchImages();
      } else if (res.status === 403) {
        handleSessionExpired();
      } else {
        showSnackbar(data.error || "Upload failed", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error uploading image", "error");
    }
  };

  // ✅ Delete image
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();

      if (res.ok) {
        showSnackbar("🗑️ Image deleted!", "info");
        fetchImages();
      } else if (res.status === 403) {
        handleSessionExpired();
      } else {
        showSnackbar(data.error || "Delete failed", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error deleting image", "error");
    }
  };

  // ✅ Handle expired sessions
  const handleSessionExpired = () => {
    showSnackbar("Session expired. Please log in again.", "warning");
    localStorage.removeItem("adminKey");
    navigate("/admin/login");
  };

  // ✅ Reusable Snackbar for feedback
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight={700}>
            🖼️ Gallery Admin Panel
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem("adminKey");
              navigate("/admin/login");
            }}
          >
            Logout
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            mt: 2,
          }}
        >
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <TextField
            select
            label="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="client">Client Transformations</MenuItem>
            <MenuItem value="wig">Wig & Hairstyling</MenuItem>
            <MenuItem value="bridal">Bridal</MenuItem>
            <MenuItem value="makeup">Makeup</MenuItem>
            <MenuItem value="behind_scenes">Behind the Scenes</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            label="Alt Text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            size="small"
          />
          <TextField
            label="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </Box>
      </Paper>

      {/* Gallery Display */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {images.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img._id}>
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    img.url.startsWith("http")
                      ? img.url
                      : `${API_BASE}${img.url}`
                  }
                  alt={img.altText}
                  sx={{
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                <Button
                  onClick={() => handleDelete(img._id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255, 0, 0, 0.85)",
                    color: "white",
                    minWidth: 36,
                    "&:hover": { bgcolor: "red" },
                  }}
                >
                  <DeleteIcon />
                </Button>
                <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                  {img.caption || "No caption"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}