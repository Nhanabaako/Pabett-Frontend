import React, { useState, useEffect, useCallback } from "react";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Box, Button, TextField, Grid, Card, CardMedia, CardContent,
  Typography, CircularProgress, Paper, Chip, FormControl,
  InputLabel, Select, MenuItem, Divider, Tooltip, IconButton,
  InputAdornment, Snackbar, Alert, Badge,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InventoryIcon from "@mui/icons-material/Inventory";

const BASE_URL = "http://localhost:5000";

// ─── Category config ────────────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  { value: "hair_oil",       label: "Hair Growth Oil",       color: "#4caf50" },
  { value: "hair_care",      label: "Hair Care",             color: "#2196f3" },
  { value: "skincare",       label: "Skincare",              color: "#e91e63" },
  { value: "accessories",    label: "Accessories",           color: "#ff9800" },
  { value: "tools",          label: "Styling Tools",         color: "#9c27b0" },
  { value: "other",          label: "Other",                 color: "#607d8b" },
];

const categoryMap = Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.value, c]));

// ─── Stat Card ───────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <Paper
    sx={{
      p: 2.5, borderRadius: 3, borderLeft: `4px solid ${color}`,
      display: "flex", alignItems: "center", gap: 2,
    }}
  >
    <Badge
      badgeContent={value}
      max={999}
      sx={{ "& .MuiBadge-badge": { bgcolor: color, color: "#fff", fontSize: "0.75rem", minWidth: 26, height: 26, borderRadius: "50%" } }}
    >
      <InventoryIcon sx={{ color, fontSize: 28 }} />
    </Badge>
    <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
  </Paper>
);

export default function ProductsAdmin() {
  const [products,  setProducts]  = useState([]);
  const [file,      setFile]      = useState(null);
  const [name,      setName]      = useState("");
  const [price,     setPrice]     = useState("");
  const [category,  setCategory]  = useState("hair_oil");
  const [filterCat, setFilterCat] = useState("all");
  const [search,    setSearch]    = useState("");
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar,  setSnackbar]  = useState({ open: false, msg: "", severity: "success" });

  // ── helpers ──────────────────────────────────────────────────────
  const toast = (msg, severity = "success") =>
    setSnackbar({ open: true, msg, severity });

  // ── fetch ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      toast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── upload ────────────────────────────────────────────────────────
  const uploadProduct = async () => {
    if (!file || !name.trim() || !price) {
      toast("Please fill all fields and select an image", "warning");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image",    file);
      formData.append("name",     name);
      formData.append("price",    price);
      formData.append("category", category);

      const res  = await fetch(`${BASE_URL}/api/products`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast("Product uploaded successfully ✅");
      setFile(null); setName(""); setPrice(""); setCategory("hair_oil");
      fetchProducts();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // ── delete ────────────────────────────────────────────────────────
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast("Product deleted", "info");
    } catch {
      toast("Delete failed", "error");
    }
  };

  // ── derived data ──────────────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchCat    = filterCat === "all" || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const countByCategory = (cat) =>
    cat === "all" ? products.length : products.filter((p) => p.category === cat).length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>

      {/* ── Header ── */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <AddPhotoAlternateIcon sx={{ fontSize: 36, color: "#00B6AD" }} />
        <Box>
          <Typography variant="h4" fontWeight={800} color="#2C3E64">
            Product Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} product{products.length !== 1 ? "s" : ""} in catalogue
          </Typography>
        </Box>
      </Box>

      {/* ── Stats Row ── */}
      <Grid container spacing={2} mb={4}>
        {PRODUCT_CATEGORIES.map((cat) => (
          <Grid item xs={6} sm={4} md={2} key={cat.value}>
            <StatCard
              label={cat.label}
              value={products.filter((p) => p.category === cat.value).length}
              color={cat.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* ── Upload Form ── */}
      <Paper sx={{ p: 3, mb: 5, borderRadius: 3, border: "1px solid #e8f4f3" }}>
        <Typography variant="h6" fontWeight={700} mb={2} color="#2C3E64">
          ➕ Add New Product
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <UploadDropzone onChange={setFile} multiple={false} />

        {file && (
          <Box mt={2} display="flex" alignItems="center" gap={1.5}>
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
            />
            <Box>
              <Typography variant="body2" fontWeight={600}>{file.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <Button size="small" color="error" onClick={() => setFile(null)} sx={{ ml: "auto" }}>
              Remove
            </Button>
          </Box>
        )}

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Product Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Price (GHC)"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              size="small"
              InputProps={{ startAdornment: <InputAdornment position="start">₵</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category / Section</InputLabel>
              <Select
                value={category}
                label="Category / Section"
                onChange={(e) => setCategory(e.target.value)}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c.color }}
                      />
                      {c.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{
            mt: 3, bgcolor: "#00B6AD", borderRadius: "999px", px: 4,
            "&:hover": { bgcolor: "#009688" },
          }}
          onClick={uploadProduct}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={20} color="inherit" /> : "Upload Product"}
        </Button>
      </Paper>

      {/* ── Filter Bar ── */}
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={3}>
        <TextField
          size="small"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 0.5, color: "text.disabled" }} /> }}
          sx={{ width: 240 }}
        />

        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          {[{ value: "all", label: "All", color: "#2C3E64" }, ...PRODUCT_CATEGORIES].map((c) => (
            <Chip
              key={c.value}
              label={`${c.label} (${countByCategory(c.value)})`}
              onClick={() => setFilterCat(c.value)}
              size="small"
              sx={{
                bgcolor: filterCat === c.value ? c.color : "transparent",
                color:   filterCat === c.value ? "#fff"   : "text.secondary",
                border:  `1px solid ${c.color}`,
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { bgcolor: c.color, color: "#fff" },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* ── Product Grid ── */}
      {loading ? (
        <Box textAlign="center" py={8}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography color="text.secondary">No products found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((p) => {
            const cat = categoryMap[p.category] || categoryMap.other;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
                <Card
                  sx={{
                    borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    overflow: "hidden", height: "100%", display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.14)" },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${BASE_URL}${p.image}`}
                      alt={p.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <Chip
                      label={cat.label}
                      size="small"
                      sx={{
                        position: "absolute", top: 8, left: 8,
                        bgcolor: cat.color, color: "#fff", fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography fontWeight={700} gutterBottom noWrap title={p.name}>
                      {p.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#00B6AD", fontWeight: 800, mb: "auto" }}
                    >
                      ₵{Number(p.price).toFixed(2)}
                    </Typography>

                    <Tooltip title="Delete product" placement="top">
                      <IconButton
                        onClick={() => deleteProduct(p._id)}
                        color="error"
                        size="small"
                        sx={{
                          mt: 2, alignSelf: "flex-end",
                          border: "1px solid rgba(211,47,47,0.3)",
                          "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

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