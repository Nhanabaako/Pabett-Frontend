// src/pages/admin/ProductsAdmin.js
import React, { useState, useEffect, useCallback } from "react";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Box, Button, TextField, Grid, Card, CardMedia, CardContent,
  Typography, CircularProgress, Paper, FormControl,
  InputLabel, Select, MenuItem, InputAdornment,
  Snackbar, Alert, IconButton, Chip, Stack,
} from "@mui/material";
import DeleteOutlineIcon     from "@mui/icons-material/DeleteOutline";
import SearchIcon            from "@mui/icons-material/Search";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL || "https://pabett.onrender.com";

// ✅ UPDATED CATEGORIES — must mirror VALID_CATEGORIES in routes/products.js
const PRODUCT_CATEGORIES = [
  { value: "hair_oil",   label: "Hair Growth Oil",                    color: "#4caf50",
    hint: "Oils, serums, and treatments for hair growth" },
  { value: "hair_care",  label: "Hair Care",                          color: "#2196f3",
    hint: "Shampoos, conditioners, masks, and styling products" },
  { value: "hair_sales", label: "Hair Sales (Wigs, Weaves & Curls)",  color: "#00B6AD",
    hint: "Human hair, synthetic hair, wigs, blunt cuts, curls, braids" },
  { value: "skincare",   label: "Skincare Products",                  color: "#e91e63",
    hint: "Cleansers, moisturisers, SPF, serums, and body care" },
  { value: "makeup",     label: "Hair & Makeup Products",             color: "#ff5722",
    hint: "Foundation, lipstick, eyeshadow, brushes, setting sprays" },
  { value: "accessories",label: "Accessories",                        color: "#ff9800",
    hint: "Hair clips, bonnets, headbands, scarves, and more" },
  { value: "tools",      label: "Styling Tools",                      color: "#9c27b0",
    hint: "Blow dryers, flat irons, curlers, combs, and brushes" },
  { value: "other",      label: "Other",                              color: "#607d8b",
    hint: "Anything that doesn't fit the above categories" },
];

const THEME = { primary: "#00B6AD", darkText: "#2C3E64" };

export default function ProductsAdmin() {
  const token    = localStorage.getItem("token");
  const adminKey = localStorage.getItem("adminKey");

  const [products,     setProducts]     = useState([]);
  const [file,         setFile]         = useState(null);
  const [name,         setName]         = useState("");
  const [price,        setPrice]        = useState("");
  const [description,  setDescription]  = useState("");   // ✅ NEW
  const [category,     setCategory]     = useState("hair_oil");
  const [search,       setSearch]       = useState("");
  const [filterCat,    setFilterCat]    = useState("all"); // ✅ NEW filter
  const [loading,      setLoading]      = useState(true);
  const [uploading,    setUploading]    = useState(false);
  const [snackbar,     setSnackbar]     = useState({ open: false, msg: "", severity: "success" });

  const toast = (msg, severity = "success") =>
    setSnackbar({ open: true, msg, severity });

  const authHeaders = () => {
    const h = {};
    if (token)    h["Authorization"] = `Bearer ${token}`;
    if (adminKey) h["x-admin-key"]   = adminKey;
    return h;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const uploadProduct = async () => {
    if (!token && !adminKey) {
      toast("Login required", "warning");
      window.location.href = "/admin/login";
      return;
    }
    if (!file || !name.trim() || !price) {
      return toast("Please fill in name & price and select an image", "warning");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image",       file);
      formData.append("name",        name.trim());
      formData.append("price",       price);
      formData.append("category",    category);
      formData.append("description", description.trim()); // ✅ send description

      const res = await fetch(`${BASE_URL}/api/products`, {
        method:  "POST",
        headers: authHeaders(),
        body:    formData,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminKey");
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast(`✅ "${data.name}" saved to Cloudinary!`);
      setFile(null);
      setName("");
      setPrice("");
      setDescription("");
      fetchProducts();
    } catch (err) {
      toast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method:  "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminKey");
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast("🗑️ Product deleted");
    } catch (err) {
      toast(err.message || "Delete failed", "error");
    }
  };

  const getCategoryMeta = (val) =>
    PRODUCT_CATEGORIES.find((c) => c.value === val) ||
    PRODUCT_CATEGORIES[PRODUCT_CATEGORIES.length - 1];

  // Active category hint
  const activeCatMeta = PRODUCT_CATEGORIES.find((c) => c.value === category);

  // Filter products by search + category
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === "all" || (p.category || "other") === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <Box>
      {/* ── Upload Panel ── */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 4, borderRadius: 3,
          border: "1px solid #e0e7ef",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
          <AddPhotoAlternateIcon sx={{ color: THEME.primary }} />
          <Typography variant="h6" fontWeight={700} color={THEME.darkText}>
            Add New Product
          </Typography>
        </Stack>

        <UploadDropzone onChange={setFile} multiple={false} />

        <Grid container spacing={2} mt={1}>
          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Product Name *"
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Pabett Hair Growth Oil"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&:hover fieldset": { borderColor: THEME.primary }, "&.Mui-focused fieldset": { borderColor: THEME.primary } } }}
            />
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Price (₵) *" type="number"
              value={price} onChange={(e) => setPrice(e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: <InputAdornment position="start">₵</InputAdornment> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&:hover fieldset": { borderColor: THEME.primary }, "&.Mui-focused fieldset": { borderColor: THEME.primary } } }}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                value={category} label="Category *"
                onChange={(e) => setCategory(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c.color, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{c.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.hint}</Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Hint text below category */}
            {activeCatMeta && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", pl: 1 }}>
                💡 {activeCatMeta.hint}
              </Typography>
            )}
          </Grid>

          {/* ✅ Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description (optional)"
              multiline
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product — ingredients, usage, hair type, shade range, pack size, etc."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&:hover fieldset": { borderColor: THEME.primary }, "&.Mui-focused fieldset": { borderColor: THEME.primary } } }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={uploadProduct}
          disabled={uploading}
          sx={{
            mt: 3, borderRadius: "999px", px: 4, py: 1.2,
            bgcolor: THEME.primary, fontWeight: 700,
            "&:hover": { bgcolor: "#009688" },
          }}
        >
          {uploading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} sx={{ color: "#fff" }} />
              <span>Uploading to Cloudinary…</span>
            </Stack>
          ) : "Upload Product"}
        </Button>
      </Paper>

      {/* ── Search + Category Filter ── */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Filter Category</InputLabel>
          <Select
            value={filterCat}
            label="Filter Category"
            onChange={(e) => setFilterCat(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {PRODUCT_CATEGORIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: c.color }} />
                  {c.label}
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* ── Product Count Summary ── */}
      {!loading && (
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2.5}>
          <Chip
            label={`All (${products.length})`}
            size="small"
            onClick={() => setFilterCat("all")}
            sx={{ bgcolor: filterCat === "all" ? THEME.darkText : "#eee", color: filterCat === "all" ? "#fff" : "inherit", fontWeight: 700 }}
          />
          {PRODUCT_CATEGORIES.map((c) => {
            const count = products.filter((p) => (p.category || "other") === c.value).length;
            if (!count) return null;
            return (
              <Chip
                key={c.value}
                label={`${c.label} (${count})`}
                size="small"
                onClick={() => setFilterCat(c.value)}
                sx={{ bgcolor: filterCat === c.value ? c.color : "#eee", color: filterCat === c.value ? "#fff" : "inherit", fontWeight: 600 }}
              />
            );
          })}
        </Stack>
      )}

      {/* ── Product Grid ── */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress sx={{ color: THEME.primary }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" py={6}>
          {search || filterCat !== "all"
            ? "No products match your search / filter."
            : "No products yet. Upload your first one!"}
        </Typography>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((p) => {
            const meta = getCategoryMeta(p.category);
            return (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card
                  sx={{
                    borderRadius: 3, overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    {/* ✅ Cloudinary URL is already absolute — no BASE_URL prefix */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={p.image}
                      alt={p.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <Chip
                      label={meta.label}
                      size="small"
                      sx={{
                        position: "absolute", top: 8, left: 8,
                        bgcolor: meta.color, color: "#fff",
                        fontWeight: 700, fontSize: "0.68rem",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography fontWeight={700} color={THEME.darkText} noWrap title={p.name}>
                      {p.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: THEME.primary, fontWeight: 800, mb: 0.5 }}>
                      ₵{Number(p.price).toFixed(2)}
                    </Typography>
                    {/* ✅ Show description if present */}
                    {p.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 1,
                        }}
                      >
                        {p.description}
                      </Typography>
                    )}
                    <Button
                      fullWidth variant="outlined" color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => deleteProduct(p._id)}
                      sx={{ borderRadius: "999px", fontWeight: 600, mt: 0.5 }}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}