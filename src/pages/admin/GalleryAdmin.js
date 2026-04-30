import React, { useState, useEffect, useCallback } from "react";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Box, Button, TextField, CircularProgress, Paper, FormControl,
  InputLabel, Select, MenuItem, Snackbar, Alert, Stack, Typography,
  IconButton, Menu, MenuItem as MuiMenuItem, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MoreVertIcon          from "@mui/icons-material/MoreVert";
import VisibilityIcon        from "@mui/icons-material/Visibility";
import EditIcon              from "@mui/icons-material/Edit";
import DeleteOutlineIcon     from "@mui/icons-material/DeleteOutline";
import SearchIcon            from "@mui/icons-material/Search";
import { adminHeaders }     from "../../api/api";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : process.env.REACT_APP_API_URL || "https://pabett.onrender.com";

const GALLERY_SECTIONS = [
  { value: "client",       label: "Client Transformations" },
  { value: "wig",          label: "Wig & Hairstyling" },
  { value: "bridal",       label: "Bridal" },
  { value: "makeup",       label: "Makeup" },
  { value: "behind_scenes",label: "Behind the Scenes" },
  { value: "other",        label: "Other" },
];

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

export default function GalleryAdmin() {

  const [images,   setImages]   = useState([]);
  const [files,    setFiles]    = useState([]);
  const [section,  setSection]  = useState("client");
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [uploading,setUploading]= useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });

  const [view,       setView]       = useState(null);
  const [editOpen,   setEditOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm,   setEditForm]   = useState({ caption: "", altText: "", section: "client" });
  const [editSaving, setEditSaving] = useState(false);

  const toast = (msg, severity = "success") => setSnackbar({ open: true, msg, severity });

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/gallery`);
      const data = await res.json();
      setImages(data.images || []);
    } catch { toast("Failed to load gallery", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const uploadImages = async () => {
    if (!files.length) { toast("Select at least one image", "warning"); return; }
    setUploading(true);
    try {
      const { 'Content-Type': _ct, ...uploadHeaders } = adminHeaders();
      for (const file of files) {
        const fd = new FormData();
        fd.append("section", section);
        fd.append("image", file);
        const res = await fetch(`${BASE_URL}/api/gallery/upload`, { method: "POST", headers: uploadHeaders, body: fd });
        if (res.status === 401 || res.status === 403) { toast("Session expired — please log in again", "warning"); window.location.href = "/admin/login"; return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
      }
      toast("Images uploaded");
      setFiles([]); fetchImages();
    } catch (err) { toast(err.message || "Upload failed", "error"); }
    finally { setUploading(false); }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/gallery/${id}`, { method: "DELETE", headers: adminHeaders() });
      if (res.status === 401 || res.status === 403) { window.location.href = "/admin/login"; return; }
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast("Deleted");
    } catch { toast("Delete failed", "error"); }
  };

  const openEdit = (img) => {
    setEditTarget(img._id);
    setEditForm({ caption: img.caption || "", altText: img.altText || "", section: img.section || "client" });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/gallery/${editTarget}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Update failed"); }
      toast("Image updated"); setEditOpen(false); fetchImages();
    } catch (err) { toast(err.message || "Update failed", "error"); }
    finally { setEditSaving(false); }
  };

  const sectionLabel = (val) => GALLERY_SECTIONS.find((s) => s.value === val)?.label || val;

  const filtered = images.filter((img) =>
    (img.caption || "").toLowerCase().includes(search.toLowerCase()) ||
    sectionLabel(img.section).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3.5, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: "#1E2D4F", mb: 0.5 }}>
            Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      {/* Upload Panel */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid #e0e7ef", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
          <AddPhotoAlternateIcon sx={{ color: "#00B6AD" }} />
          <Typography variant="h6" fontWeight={700} color="#2C3E64">Upload Images</Typography>
        </Stack>
        <UploadDropzone onChange={setFiles} multiple />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Section</InputLabel>
          <Select value={section} label="Section" onChange={(e) => setSection(e.target.value)}>
            {GALLERY_SECTIONS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={uploadImages} disabled={uploading}
          sx={{ mt: 3, borderRadius: "999px", px: 4, py: 1.2, bgcolor: "#00B6AD", fontWeight: 700, "&:hover": { bgcolor: "#009688" } }}>
          {uploading ? <Stack direction="row" spacing={1} alignItems="center"><CircularProgress size={18} sx={{ color: "#fff" }} /><span>Uploading…</span></Stack> : "Upload"}
        </Button>
      </Paper>

      {/* Search */}
      <TextField placeholder="Search by caption or section…" value={search} onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> }}
        fullWidth sx={{ mb: 3 }} />

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress sx={{ color: "#00B6AD" }} /></Box>
      ) : filtered.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" py={6}>No images found.</Typography>
      ) : (
        <TableContainer sx={{ border: "1px solid #E2EBE9", borderRadius: "10px", overflow: "hidden", bgcolor: "#fff" }}>
          <Table>
            <TableHead>
              <TableRow>
                {["Thumbnail", "Caption", "Alt Text", "Section", "Actions"].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((img) => (
                <TableRow key={img._id} sx={TR}>
                  <TableCell sx={{ ...TD, width: 72 }}>
                    <img
                      src={img.url?.startsWith("http") ? img.url : `${BASE_URL}${img.url}`}
                      alt={img.altText || "Gallery"}
                      style={{ width: 60, height: 48, objectFit: "cover", borderRadius: 6 }}
                    />
                  </TableCell>
                  <TableCell sx={TD}>{img.caption || <Typography component="span" sx={{ color: "#7E8AA8" }}>—</Typography>}</TableCell>
                  <TableCell sx={{ ...TD, fontSize: "0.82rem", color: "#7E8AA8" }}>{img.altText || "—"}</TableCell>
                  <TableCell sx={TD}>
                    <Chip
                      label={sectionLabel(img.section)}
                      size="small"
                      sx={{ bgcolor: "#E0F9F7", color: "#2BB5A8", fontWeight: 700, fontSize: "0.72rem", borderRadius: "999px", height: 22 }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...TD, width: 48 }}>
                    <ActionsMenu items={[
                      { label: "View",   icon: <VisibilityIcon sx={{ fontSize: 16 }} />,   onClick: () => setView(img) },
                      { label: "Edit",   icon: <EditIcon sx={{ fontSize: 16 }} />,          onClick: () => openEdit(img) },
                      { label: "Delete", icon: <DeleteOutlineIcon sx={{ fontSize: 16 }} />, onClick: () => deleteImage(img._id), danger: true },
                    ]} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog open={Boolean(view)} onClose={() => setView(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500 }}>Image Details</DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2}>
              <img src={view.url?.startsWith("http") ? view.url : `${BASE_URL}${view.url}`} alt={view.altText || "Gallery"} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 8 }} />
              <Stack direction="row" spacing={4} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" sx={{ color: "#7E8AA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Section</Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 600, color: "#2BB5A8" }}>{sectionLabel(view.section)}</Typography>
                </Box>
                {view.caption && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "#7E8AA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Caption</Typography>
                    <Typography sx={{ mt: 0.5 }}>{view.caption}</Typography>
                  </Box>
                )}
                {view.altText && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "#7E8AA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Alt Text</Typography>
                    <Typography sx={{ mt: 0.5 }}>{view.altText}</Typography>
                  </Box>
                )}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setView(null)}>Close</Button>
          <Button size="small" variant="contained" onClick={() => { openEdit(view); setView(null); }}>Edit</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500 }}>Edit Image</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Caption" value={editForm.caption} onChange={(e) => setEditForm((p) => ({ ...p, caption: e.target.value }))} size="small" />
            <TextField label="Alt Text" value={editForm.altText} onChange={(e) => setEditForm((p) => ({ ...p, altText: e.target.value }))} size="small" />
            <FormControl size="small" fullWidth>
              <InputLabel>Section</InputLabel>
              <Select value={editForm.section} label="Section" onChange={(e) => setEditForm((p) => ({ ...p, section: e.target.value }))}>
                {GALLERY_SECTIONS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={saveEdit} disabled={editSaving}>
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
