import React, { useState, useEffect } from 'react';
import {
  Box, Stack, TextField, IconButton, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Switch,
  FormControlLabel, Rating, Menu, MenuItem, Typography, Divider,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import MoreVertIcon   from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon       from '@mui/icons-material/Edit';
import DeleteIcon     from '@mui/icons-material/Delete';
import ToggleOnIcon   from '@mui/icons-material/ToggleOn';
import { BASE_URL, adminHeaders } from '../../api/api';

const TH = {
  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: '#7E8AA8', py: 1.25, px: 2,
  whiteSpace: 'nowrap', bgcolor: '#F7FAF9', borderBottom: '1px solid #E2EBE9',
};
const TD = { py: 1.625, px: 2, fontSize: '0.875rem', verticalAlign: 'middle', color: '#1E2D4F' };
const TR = { '&:last-child td': { borderBottom: 0 }, '&:hover td': { bgcolor: '#FAFCFC' } };

const EMPTY = { quote: '', author: '', role: '', service: '', rating: 5, visible: true, order: 0 };

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

export default function TestimonialsAdmin() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [view,    setView]    = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/testimonials`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setItems).catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ quote: t.quote, author: t.author, role: t.role || '', service: t.service || '', rating: t.rating || 5, visible: t.visible !== false, order: t.order || 0 });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const url = editing ? `${BASE_URL}/api/testimonials/${editing}` : `${BASE_URL}/api/testimonials`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: adminHeaders(), body: JSON.stringify(form) });
    setOpen(false); setSaving(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await fetch(`${BASE_URL}/api/testimonials/${id}`, { method: 'DELETE', headers: adminHeaders() });
    load();
  };

  const toggleVisible = async (t) => {
    await fetch(`${BASE_URL}/api/testimonials/${t._id}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ visible: !t.visible }) });
    load();
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Testimonials
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} client review{items.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Testimonial
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2BB5A8' }} />
        </Box>
      ) : (
        <TableContainer sx={{ border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Quote', 'Author', 'Rating', 'Visible', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((t) => (
                <TableRow key={t._id} sx={TR}>
                  <TableCell sx={{ ...TD, maxWidth: 280 }}>
                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{t.quote}"
                    </Typography>
                  </TableCell>
                  <TableCell sx={TD}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.author}</Typography>
                    {t.role && <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8' }}>{t.role}</Typography>}
                  </TableCell>
                  <TableCell sx={TD}><Rating value={t.rating} readOnly size="small" /></TableCell>
                  <TableCell sx={TD}>
                    <Switch
                      checked={t.visible !== false}
                      onChange={() => toggleVisible(t)}
                      size="small"
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BB5A8' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2BB5A8' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...TD, width: 48 }}>
                    <ActionsMenu items={[
                      { label: 'View',   icon: <VisibilityIcon sx={{ fontSize: 16 }} />, onClick: () => setView(t) },
                      { label: 'Edit',   icon: <EditIcon sx={{ fontSize: 16 }} />,       onClick: () => openEdit(t) },
                      { label: t.visible !== false ? 'Hide' : 'Show', icon: <ToggleOnIcon sx={{ fontSize: 16 }} />, onClick: () => toggleVisible(t) },
                      { label: 'Delete', icon: <DeleteIcon sx={{ fontSize: 16 }} />,     onClick: () => remove(t._id), danger: true },
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
          Testimonial Details
        </DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quote</Typography>
                <Typography sx={{ mt: 0.5, fontStyle: 'italic' }}>"{view.quote}"</Typography>
              </Box>
              <Divider />
              <Stack direction="row" spacing={4} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Author</Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 600 }}>{view.author}</Typography>
                </Box>
                {view.role && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Role</Typography>
                    <Typography sx={{ mt: 0.5 }}>{view.role}</Typography>
                  </Box>
                )}
                {view.service && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service</Typography>
                    <Typography sx={{ mt: 0.5 }}>{view.service}</Typography>
                  </Box>
                )}
              </Stack>
              <Box>
                <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rating</Typography>
                <Box sx={{ mt: 0.5 }}><Rating value={view.rating} readOnly size="small" /></Box>
              </Box>
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
          {editing ? 'Edit Testimonial' : 'Add Testimonial'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Quote *" value={form.quote} onChange={set('quote')} multiline rows={3} size="small" />
            <TextField label="Author *" value={form.author} onChange={set('author')} size="small" />
            <TextField label="Role (e.g. Bride)" value={form.role} onChange={set('role')} size="small" />
            <TextField label="Service slug (optional)" value={form.service} onChange={set('service')} size="small" />
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7E8AA8', display: 'block', mb: 0.75 }}>Rating</Typography>
              <Rating value={form.rating} onChange={(_, v) => setForm((p) => ({ ...p, rating: v }))} />
            </Box>
            <TextField label="Order" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} size="small" />
            <FormControlLabel control={<Switch checked={form.visible} onChange={(e) => setForm((p) => ({ ...p, visible: e.target.checked }))} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BB5A8' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2BB5A8' } }} />} label="Visible" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={save} disabled={saving || !form.quote || !form.author}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
