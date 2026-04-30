import React, { useState, useEffect, useCallback, useRef } from "react";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Box, Button, TextField, Grid, CircularProgress, Paper, FormControl,
  InputLabel, Select, MenuItem, InputAdornment, Snackbar, Alert,
  Chip, Stack, Menu, MenuItem as MuiMenuItem, IconButton, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MoreVertIcon          from "@mui/icons-material/MoreVert";
import VisibilityIcon        from "@mui/icons-material/Visibility";
import EditIcon              from "@mui/icons-material/Edit";
import DeleteOutlineIcon     from "@mui/icons-material/DeleteOutline";
import SearchIcon            from "@mui/icons-material/Search";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : process.env.REACT_APP_API_URL || "https://pabett.onrender.com";

const PRODUCT_CATEGORIES = [
  { value: "hair_oil",    label: "Hair Growth Oil",                   color: "#4caf50" },
  { value: "hair_care",  label: "Hair Care",                          color: "#2196f3" },
  { value: "hair_sales", label: "Hair Sales (Wigs, Weaves & Curls)",  color: "#00B6AD" },
  { value: "skincare",   label: "Skincare Products",                  color: "#e91e63" },
  { value: "makeup",     label: "Hair & Makeup Products",             color: "#ff5722" },
  { value: "accessories",label: "Accessories",                        color: "#ff9800" },
  { value: "tools",      label: "Styling Tools",                      color: "#9c27b0" },
  { value: "other",      label: "Other",                              color: "#607d8b" },
];

const THEME = { primary: "#00B6AD", darkText: "#2C3E64" };

const TH = {
  fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
  textTransform: "uppercase", color: "#7E8AA8", py: 1.25, px: 2,
  whiteSpace: "nowrap", bgcolor: "#F7FAF9", borderBottom: "1px solid #E2EBE9",
};
const TD = { py: 1.625, px: 2, fontSize: "0.875rem", verticalAlign: "middle", color: "#1E2D4F" };
const TR = { "&:last-child td": { borderBottom: 0 }, "&:hover td": { bgcolor: "#FAFCFC" } };

function ActionsMenu({ items }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreVertIcon sx={{ fontSize: 18, color: "#7E8AA8" }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: 150 } }}
      >
        {items.map((item) => (
          <MuiMenuItem
            key={item.label}
            onClick={() => { item.onClick(); setAnchor(null); }}
            sx={{ fontSize: "0.85rem", gap: 1.5, color: item.danger ? "#C0392B" : "inherit", py: 1 }}
          >
            {item.icon}
            {item.label}
          </MuiMenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function ProductsAdmin() {
  const token    = localStorage.getItem("token");
  const adminKey = localStorage.getItem("adminKey");
  const editFileRef = useRef();

  const [products,    setProducts]    = useState([]);
  const [file,        setFile]        = useState(null);
  const [name,        setName]        = useState("");
  const [price,       setPrice]       = useState("");
  const [description, setDescription] = useState("");
  const [category,    setCategory]    = useState("hair_oil");
  const [search,      setSearch]      = useState("");
  const [filterCat,   setFilterCat]   = useState("all");
  const [loading,     setLoading]     = useState(true);
  const [uploading,   setUploading]   = useState(false);
  const [snackbar,    setSnackbar]    = useState({ open: false, msg: "", severity: "success" });

  const [view,       setView]       = useState(null);
  const [editOpen,   setEditOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm,   setEditForm]   = useState({ name: "", price: "", description: "", category: "hair_oil" });
  const [editFile,   setEditFile]   = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const toast = (msg, severity = "success") => setSnackbar({ open: true, msg, severity });

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
    if (!token && !adminKey) { toast("Login required", "warning"); window.location.href = "/admin/login"; return; }
    if (!file || !name.trim() || !price) return toast("Fill in name & price and select an image", "warning");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("price", price);
      fd.append("category", category);
      fd.append("description", description.trim());
      fd.append("image", file);
      const res = await fetch(`${BASE_URL}/api/products`, { method: "POST", headers: authHeaders(), body: fd });
      if (res.status === 401 || res.status === 403) { localStorage.removeItem("token"); localStorage.removeItem("adminKey"); window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast(`"${data.name}" saved`);
      setFile(null); setName(""); setPrice(""); setDescription("");
      fetchProducts();
    } catch (err) { toast(err.message || "Upload failed", "error"); }
    finally { setUploading(false); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { localStorage.removeItem("token"); localStorage.removeItem("adminKey"); window.location.href = "/admin/login"; return; }
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Delete failed"); }
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast("Product deleted");
    } catch (err) { toast(err.message || "Delete failed", "error"); }
  };

  const openEdit = (p) => {
    setEditTarget(p._id);
    setEditForm({ name: p.name, price: String(p.price), description: p.description || "", category: p.category || "other" });
    setEditFile(null); setEditOpen(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", editForm.name.trim()); fd.append("price", editForm.price);
      fd.append("description", editForm.description.trim()); fd.append("category", editForm.category);
      if (editFile) fd.append("image", editFile);
      const res = await fetch(`${BASE_URL}/api/products/${editTarget}`, { method: "PATCH", headers: authHeaders(), body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Update failed"); }
      toast("Product updated"); setEditOpen(false); fetchProducts();
    } catch (err) { toast(err.message || "Update failed", "error"); }
    finally { setEditSaving(false); }
  };

  const getCategoryMeta = (val) => PRODUCT_CATEGORIES.find((c) => c.value === val) || PRODUCT_CATEGORIES[PRODUCT_CATEGORIES.length - 1];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === "all" || (p.category || "other") === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3.5, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: "#1E2D4F", mb: 0.5 }}>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      {/* Upload Panel */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid #e0e7ef", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
          <AddPhotoAlternateIcon sx={{ color: THEME.primary }} />
          <Typography variant="h6" fontWeight={700} color={THEME.darkText}>Add New Product</Typography>
        </Stack>
        <UploadDropzone onChange={setFile} multiple={false} />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Product Name *" value={name} onChange={(e) => setName(e.target.value)} /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Price (₵) *" type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start">₵</InputAdornment> }} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select value={category} label="Category *" onChange={(e) => setCategory(e.target.value)}>
                {PRODUCT_CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description (optional)" multiline minRows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={uploadProduct} disabled={uploading}
          sx={{ mt: 3, borderRadius: "999px", px: 4, py: 1.2, bgcolor: THEME.primary, fontWeight: 700, "&:hover": { bgcolor: "#009688" } }}>
          {uploading ? <Stack direction="row" spacing={1} alignItems="center"><CircularProgress size={18} sx={{ color: "#fff" }} /><span>Uploading…</span></Stack> : "Upload Product"}
        </Button>
      </Paper>

      {/* Search + Filter */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary" }} /></InputAdornment> }} />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter Category</InputLabel>
          <Select value={filterCat} label="Filter Category" onChange={(e) => setFilterCat(e.target.value)}>
            <MenuItem value="all">All Categories</MenuItem>
            {PRODUCT_CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress sx={{ color: THEME.primary }} /></Box>
      ) : filtered.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" py={6}>
          {search || filterCat !== "all" ? "No products match your search / filter." : "No products yet. Upload your first one!"}
        </Typography>
      ) : (
        <TableContainer sx={{ border: "1px solid #E2EBE9", borderRadius: "10px", overflow: "hidden", bgcolor: "#fff" }}>
          <Table>
            <TableHead>
              <TableRow>
                {["Image", "Name", "Price", "Category", "Description", "Actions"].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => {
                const meta = getCategoryMeta(p.category);
                return (
                  <TableRow key={p._id} sx={TR}>
                    <TableCell sx={{ ...TD, width: 64 }}>
                      <img src={p.image} alt={p.name} style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 6 }} />
                    </TableCell>
                    <TableCell sx={{ ...TD, fontWeight: 600 }}>{p.name}</TableCell>
                    <TableCell sx={{ ...TD, fontWeight: 700, color: THEME.primary }}>₵{Number(p.price).toFixed(2)}</TableCell>
                    <TableCell sx={TD}>
                      <Chip label={meta.label} size="small" sx={{ bgcolor: meta.color, color: "#fff", fontWeight: 700, fontSize: "0.68rem", borderRadius: "999px", height: 22 }} />
                    </TableCell>
                    <TableCell sx={{ ...TD, maxWidth: 220 }}>
                      <Typography sx={{ fontSize: "0.82rem", color: "#7E8AA8", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.description || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ ...TD, width: 48 }}>
                      <ActionsMenu items={[
                        { label: "View",   icon: <VisibilityIcon sx={{ fontSize: 16 }} />,    onClick: () => setView(p) },
                        { label: "Edit",   icon: <EditIcon sx={{ fontSize: 16 }} />,           onClick: () => openEdit(p) },
                        { label: "Delete", icon: <DeleteOutlineIcon sx={{ fontSize: 16 }} />,  onClick: () => deleteProduct(p._id), danger: true },
                      ]} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog open={Boolean(view)} onClose={() => setView(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500 }}>Product Details</DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2}>
              <img src={view.image} alt={view.name} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
              <Typography fontWeight={700} fontSize="1.1rem">{view.name}</Typography>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#7E8AA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Price</Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 700, color: THEME.primary, fontSize: "1.1rem" }}>₵{Number(view.price).toFixed(2)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#7E8AA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Category</Typography>
                  <Box sx={{ mt: 0.5 }}><Chip label={getCategoryMeta(view.category).label} size="small" sx={{ bgcolor: getCategoryMeta(view.category).color, color: "#fff", fontWeight: 700, borderRadius: "999px", height: 22 }} /></Box>
                </Box>
              </Stack>
              {view.description && (
                <Box>
                  <Typography variant="caption" sx={{ color: "#7E8AA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Description</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "#3A4B70" }}>{view.description}</Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setView(null)}>Close</Button>
          <Button size="small" variant="contained" onClick={() => { openEdit(view); setView(null); }}>Edit</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500 }}>Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Product Name *" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} size="small" />
            <TextField label="Price (₵) *" type="number" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} size="small"
              InputProps={{ startAdornment: <InputAdornment position="start">₵</InputAdornment> }} />
            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={editForm.category} label="Category" onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}>
                {PRODUCT_CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Description" value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} multiline rows={3} size="small" />
            <Button variant="outlined" size="small" onClick={() => editFileRef.current.click()} sx={{ borderRadius: 2 }}>
              {editFile ? editFile.name : "Replace Image (optional)"}
            </Button>
            <input ref={editFileRef} type="file" accept="image/*" hidden onChange={(e) => setEditFile(e.target.files[0])} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={saveEdit} disabled={editSaving || !editForm.name || !editForm.price}>
            {editSaving ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ borderRadius: 2, fontWeight: 600 }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
