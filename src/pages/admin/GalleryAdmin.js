import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Button, Grid, Card, CardMedia, CardContent,
  CircularProgress, Paper, Chip, FormControl, InputLabel, Select,
  MenuItem, TextField, Divider, IconButton, Tooltip, InputAdornment,
  Snackbar, Alert, Dialog, DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UploadDropzone from "../../components/UploadDropzone";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon        from "@mui/icons-material/Search";
import FilterListIcon    from "@mui/icons-material/FilterList";
import ZoomInIcon        from "@mui/icons-material/ZoomIn";
import CollectionsIcon   from "@mui/icons-material/Collections";

const BASE_URL = "http://localhost:5000";

// ─── Section config ──────────────────────────────────────────────────
const GALLERY_SECTIONS = [
  { value: "client",      label: "Client Transformations", color: "#00B6AD" },
  { value: "wig",         label: "Wig & Hairstyling",      color: "#9c27b0" },
  { value: "bridal",      label: "Bridal",                 color: "#e91e63" },
  { value: "makeup",      label: "Makeup",                 color: "#ff5722" },
  { value: "behind_scenes", label: "Behind the Scenes",   color: "#607d8b" },
  { value: "other",       label: "Other",                  color: "#795548" },
];

const sectionMap = Object.fromEntries(GALLERY_SECTIONS.map((s) => [s.value, s]));

export default function GalleryAdmin() {
  const navigate   = useNavigate();
  const adminKey   = localStorage.getItem("adminKey");

  const [images,    setImages]    = useState([]);
  const [files,     setFiles]     = useState([]);
  const [section,   setSection]   = useState("client");
  const [altText,   setAltText]   = useState("");
  const [caption,   setCaption]   = useState("");
  const [filterSec, setFilterSec] = useState("all");
  const [search,    setSearch]    = useState("");
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(null);   // lightbox
  const [snackbar,  setSnackbar]  = useState({ open: false, msg: "", severity: "success" });

  const toast = (msg, severity = "success") =>
    setSnackbar({ open: true, msg, severity });

  // ── auth guard ──────────────────────────────────────────────────
  useEffect(() => {
    if (!adminKey) navigate("/admin/login");
    else fetchImages();
  }, [adminKey, navigate]); // eslint-disable-line

  // ── fetch ────────────────────────────────────────────────────────
  const fetchImages = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/api/gallery`);
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      toast("Failed to load gallery", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── upload ───────────────────────────────────────────────────────
  const uploadImages = async () => {
    if (!files.length) { toast("Select at least one image", "warning"); return; }
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("image",   file);
        formData.append("section", section);
        formData.append("altText", altText || file.name.replace(/\.[^/.]+$/, ""));
        formData.append("caption", caption);

        const res = await fetch(`${BASE_URL}/api/gallery/upload`, {
          method: "POST",
          headers: { "x-admin-key": adminKey },
          body: formData,
        });

        if (res.status === 403) {
          toast("Session expired — please log in again", "warning");
          localStorage.removeItem("adminKey");
          navigate("/admin/login");
          return;
        }
      }

      setFiles([]);
      setAltText("");
      setCaption("");
      await fetchImages();
      toast(`${files.length} image${files.length > 1 ? "s" : ""} uploaded ✅`);
    } catch {
      toast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ── delete ───────────────────────────────────────────────────────
  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (res.status === 403) {
        toast("Session expired", "warning");
        localStorage.removeItem("adminKey");
        navigate("/admin/login");
        return;
      }
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast("Image deleted", "info");
    } catch {
      toast("Delete failed", "error");
    }
  };

  // ── derived ──────────────────────────────────────────────────────
  const filtered = images.filter((img) => {
    const matchSec    = filterSec === "all" || img.section === filterSec;
    const matchSearch = (img.caption || img.altText || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchSec && matchSearch;
  });

  const countBySection = (sec) =>
    sec === "all" ? images.length : images.filter((i) => i.section === sec).length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>

      {/* ── Header ── */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <CollectionsIcon sx={{ fontSize: 36, color: "#00B6AD" }} />
        <Box>
          <Typography variant="h4" fontWeight={800} color="#2C3E64">
            Gallery Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {images.length} image{images.length !== 1 ? "s" : ""} across{" "}
            {GALLERY_SECTIONS.length} sections
          </Typography>
        </Box>
      </Box>

      {/* ── Section Summary ── */}
      <Grid container spacing={2} mb={4}>
        {GALLERY_SECTIONS.map((sec) => (
          <Grid item xs={6} sm={4} md={2} key={sec.value}>
            <Paper
              sx={{
                p: 2, borderRadius: 3, textAlign: "center",
                borderTop: `4px solid ${sec.color}`,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 4 },
                boxShadow: filterSec === sec.value ? 4 : 1,
              }}
              onClick={() => setFilterSec(filterSec === sec.value ? "all" : sec.value)}
            >
              <Typography variant="h5" fontWeight={800} color={sec.color}>
                {images.filter((i) => i.section === sec.value).length}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {sec.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Upload Form ── */}
      <Paper sx={{ p: 3, mb: 5, borderRadius: 3, border: "1px solid #e8f4f3" }}>
        <Typography variant="h6" fontWeight={700} mb={2} color="#2C3E64">
          📤 Upload Images
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <UploadDropzone onFiles={setFiles} />

        {/* Previews */}
        {files.length > 0 && (
          <Grid container spacing={1.5} mt={1.5}>
            {files.map((file, i) => (
              <Grid item xs={4} sm={3} md={2} key={i}>
                <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${i}`}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    sx={{
                      position: "absolute", top: 2, right: 2,
                      bgcolor: "rgba(0,0,0,0.55)", color: "#fff", padding: "2px",
                      "&:hover": { bgcolor: "rgba(211,47,47,0.85)" },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Metadata fields */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Gallery Section *</InputLabel>
              <Select
                value={section}
                label="Gallery Section *"
                onChange={(e) => setSection(e.target.value)}
              >
                {GALLERY_SECTIONS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: s.color }} />
                      {s.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Alt Text (for SEO)"
              fullWidth
              size="small"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g., Client bridal transformation"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Caption (optional)"
              fullWidth
              size="small"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g., Bridal look, Dec 2024"
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{
            mt: 3, bgcolor: "#00B6AD", borderRadius: "999px", px: 4,
            "&:hover": { bgcolor: "#009688" },
          }}
          onClick={uploadImages}
          disabled={uploading || files.length === 0}
          startIcon={uploading ? null : <CollectionsIcon />}
        >
          {uploading
            ? <><CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />Uploading…</>
            : `Upload ${files.length || ""} Image${files.length !== 1 ? "s" : ""}`}
        </Button>
      </Paper>

      {/* ── Filter Bar ── */}
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={3}>
        <TextField
          size="small"
          placeholder="Search captions & alt text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 0.5, color: "text.disabled" }} /> }}
          sx={{ width: 260 }}
        />

        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          {[{ value: "all", label: "All", color: "#2C3E64" }, ...GALLERY_SECTIONS].map((s) => (
            <Chip
              key={s.value}
              label={`${s.label} (${countBySection(s.value)})`}
              onClick={() => setFilterSec(s.value)}
              size="small"
              sx={{
                bgcolor: filterSec === s.value ? s.color : "transparent",
                color:   filterSec === s.value ? "#fff"   : "text.secondary",
                border:  `1px solid ${s.color}`,
                fontWeight: 500, cursor: "pointer",
                "&:hover": { bgcolor: s.color, color: "#fff" },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* ── Gallery Grid ── */}
      {loading ? (
        <Box textAlign="center" py={8}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography color="text.secondary">No images found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((img) => {
            const sec = sectionMap[img.section] || sectionMap.other;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
                <Card
                  sx={{
                    borderRadius: 3, overflow: "hidden",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.14)" },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={img.url.startsWith("http") ? img.url : `${BASE_URL}${img.url}`}
                      alt={img.altText || "Gallery image"}
                      sx={{ objectFit: "cover" }}
                    />
                    {/* Section badge */}
                    <Chip
                      label={sec.label}
                      size="small"
                      sx={{
                        position: "absolute", top: 8, left: 8,
                        bgcolor: sec.color, color: "#fff", fontWeight: 600,
                        fontSize: "0.68rem",
                      }}
                    />
                    {/* Zoom preview */}
                    <Tooltip title="Preview">
                      <IconButton
                        onClick={() => setPreview(img.url.startsWith("http") ? img.url : `${BASE_URL}${img.url}`)}
                        sx={{
                          position: "absolute", top: 6, right: 6,
                          bgcolor: "rgba(0,0,0,0.45)", color: "#fff",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                        }}
                        size="small"
                      >
                        <ZoomInIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <CardContent sx={{ pb: "12px !important" }}>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {img.caption || img.altText || "—"}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <Tooltip title="Delete image">
                        <IconButton
                          size="small"
                          onClick={() => deleteImage(img._id)}
                          color="error"
                          sx={{
                            border: "1px solid rgba(211,47,47,0.3)",
                            "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* ── Lightbox ── */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md">
        <DialogContent sx={{ p: 0 }}>
          {preview && (
            <img
              src={preview}
              alt="Full preview"
              style={{ display: "block", maxWidth: "100%", maxHeight: "85vh", objectFit: "contain" }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Toast ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}