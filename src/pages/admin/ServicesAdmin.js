import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Stack, TextField, IconButton, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel,
  Menu, MenuItem, Typography, Divider, Chip,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import MoreVertIcon   from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon       from '@mui/icons-material/Edit';
import DeleteIcon     from '@mui/icons-material/Delete';
import { BASE_URL, adminHeaders } from '../../api/api';

const TH = {
  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: '#7E8AA8', py: 1.25, px: 2,
  whiteSpace: 'nowrap', bgcolor: '#F7FAF9', borderBottom: '1px solid #E2EBE9',
};
const TD = { py: 1.625, px: 2, fontSize: '0.875rem', verticalAlign: 'middle', color: '#1E2D4F' };
const TR = { '&:last-child td': { borderBottom: 0 }, '&:hover td': { bgcolor: '#FAFCFC' } };

const EMPTY = { slug: '', title: '', tagline: '', description: '', duration: '', order: 0, features: '', pricing: '', active: true };

function ActionsMenu({ items }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreVertIcon sx={{ fontSize: 18, color: '#7E8AA8' }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 150 } }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => { item.onClick(); setAnchor(null); }}
            sx={{ fontSize: '0.85rem', gap: 1.5, color: item.danger ? '#C0392B' : 'inherit', py: 1 }}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function ServicesAdmin() {
  const [services,  setServices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [open,      setOpen]      = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [view,      setView]      = useState(null);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/services`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setServices).catch(() => setServices([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setImageFile(null); setOpen(true); };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({
      slug: s.slug, title: s.title, tagline: s.tagline || '', description: s.description || '',
      duration: s.duration || '', order: s.order || 0,
      features: Array.isArray(s.features) ? s.features.join('\n') : '',
      pricing:  Array.isArray(s.pricing)  ? s.pricing.map((p) => `${p.name}:${p.price}`).join('\n') : '',
      active: s.active !== false,
    });
    setImageFile(null); setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'features') fd.append(k, JSON.stringify(v.split('\n').map((l) => l.trim()).filter(Boolean)));
      else if (k === 'pricing') {
        const rows = v.split('\n').map((l) => { const [name, price] = l.split(':'); return { name: name?.trim(), price: price?.trim() }; }).filter((r) => r.name);
        fd.append(k, JSON.stringify(rows));
      } else fd.append(k, v);
    });
    if (imageFile) fd.append('image', imageFile);
    const url    = editing ? `${BASE_URL}/api/services/${editing}` : `${BASE_URL}/api/services`;
    const method = editing ? 'PATCH' : 'POST';
    const headers = {};
    const token = localStorage.getItem('token'); const adminKey = localStorage.getItem('adminKey');
    if (token) headers['Authorization'] = `Bearer ${token}`; if (adminKey) headers['x-admin-key'] = adminKey;
    await fetch(url, { method, headers, body: fd });
    setOpen(false); setSaving(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await fetch(`${BASE_URL}/api/services/${id}`, { method: 'DELETE', headers: adminHeaders() });
    load();
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {services.length} service{services.length !== 1 ? 's' : ''} configured
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Service
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#2BB5A8' }} /></Box>
      ) : (
        <TableContainer sx={{ border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Image', 'Title', 'Tagline', 'Duration', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s._id} sx={TR}>
                  <TableCell sx={{ ...TD, width: 64 }}>
                    {s.image
                      ? <img src={s.image} alt={s.title} style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                      : <Box sx={{ width: 52, height: 40, bgcolor: '#E0F9F7', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#2BB5A8' }}>No img</Box>
                    }
                  </TableCell>
                  <TableCell sx={{ ...TD, fontWeight: 600 }}>{s.title}</TableCell>
                  <TableCell sx={{ ...TD, maxWidth: 220 }}>
                    <Typography sx={{ fontSize: '0.82rem', color: '#7E8AA8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {s.tagline || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={TD}>
                    {s.duration
                      ? <Chip label={s.duration} size="small" sx={{ bgcolor: '#e8f5f5', color: '#00B6AD', fontWeight: 600, fontSize: '0.72rem', borderRadius: '999px', height: 22 }} />
                      : <Typography sx={{ color: '#7E8AA8', fontSize: '0.82rem' }}>—</Typography>
                    }
                  </TableCell>
                  <TableCell sx={TD}>
                    <Chip
                      label={s.active !== false ? 'Active' : 'Inactive'}
                      size="small"
                      sx={s.active !== false
                        ? { bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                        : { bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ ...TD, width: 48 }}>
                    <ActionsMenu items={[
                      { label: 'View',   icon: <VisibilityIcon sx={{ fontSize: 16 }} />, onClick: () => setView(s) },
                      { label: 'Edit',   icon: <EditIcon sx={{ fontSize: 16 }} />,       onClick: () => openEdit(s) },
                      { label: 'Delete', icon: <DeleteIcon sx={{ fontSize: 16 }} />,     onClick: () => remove(s._id), danger: true },
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
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Service Details
        </DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2}>
              {view.image && <img src={view.image} alt={view.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />}
              <Box>
                <Typography fontWeight={700} fontSize="1.1rem">{view.title}</Typography>
                {view.tagline && <Typography variant="caption" color="text.secondary">{view.tagline}</Typography>}
              </Box>
              <Divider />
              {view.description && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: '0.9rem', color: '#3A4B70' }}>{view.description}</Typography>
                </Box>
              )}
              <Stack direction="row" spacing={4} flexWrap="wrap">
                {view.duration && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Duration</Typography>
                    <Typography sx={{ mt: 0.5 }}>{view.duration}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</Typography>
                  <Typography sx={{ mt: 0.5 }}>{view.active !== false ? 'Active' : 'Inactive'}</Typography>
                </Box>
              </Stack>
              {Array.isArray(view.features) && view.features.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75} mt={0.5}>
                    {view.features.map((f) => <Chip key={f} label={f} size="small" sx={{ bgcolor: '#E0F9F7', color: '#2BB5A8', borderRadius: '999px', height: 22 }} />)}
                  </Stack>
                </Box>
              )}
              {Array.isArray(view.pricing) && view.pricing.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</Typography>
                  {view.pricing.map((p) => (
                    <Stack key={p.name} direction="row" justifyContent="space-between" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                      <span>{p.name}</span><span style={{ fontWeight: 600 }}>{p.price}</span>
                    </Stack>
                  ))}
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

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          {editing ? 'Edit Service' : 'Add Service'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title *" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} size="small" />
            <TextField label="Slug (auto if blank)" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} size="small" />
            <TextField label="Tagline" value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} size="small" />
            <TextField label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} multiline rows={3} size="small" />
            <TextField label="Duration (e.g. 1–3 hrs)" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} size="small" />
            <TextField label="Features (one per line)" value={form.features} onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))} multiline rows={3} size="small" helperText="e.g. Bridal hairstyling" />
            <TextField label="Pricing (Name:Price, one per line)" value={form.pricing} onChange={(e) => setForm((p) => ({ ...p, pricing: e.target.value }))} multiline rows={3} size="small" helperText="e.g. Box Braids:GHS 250+" />
            <TextField label="Order" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} size="small" />
            <FormControlLabel control={<Switch checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />} label="Active" />
            <Button variant="outlined" onClick={() => fileRef.current.click()} size="small">
              {imageFile ? imageFile.name : 'Upload Image'}
            </Button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files[0])} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={save} disabled={saving || !form.title}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
