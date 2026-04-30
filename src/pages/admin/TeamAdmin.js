import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Stack, TextField, IconButton, CircularProgress, Avatar, Button,
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

const EMPTY = { name: '', role: '', bio: '', initials: '', color: '#00B6AD', order: 0, active: true };

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

export default function TeamAdmin() {
  const [members,   setMembers]   = useState([]);
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
    fetch(`${BASE_URL}/api/team`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setMembers).catch(() => setMembers([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setImageFile(null); setOpen(true); };
  const openEdit = (m) => {
    setEditing(m._id);
    setForm({ name: m.name, role: m.role || '', bio: m.bio || '', initials: m.initials || '', color: m.color || '#00B6AD', order: m.order || 0, active: m.active !== false });
    setImageFile(null); setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    const url    = editing ? `${BASE_URL}/api/team/${editing}` : `${BASE_URL}/api/team`;
    const method = editing ? 'PATCH' : 'POST';
    const headers = {};
    const token = localStorage.getItem('token'); const adminKey = localStorage.getItem('adminKey');
    if (token) headers['Authorization'] = `Bearer ${token}`; if (adminKey) headers['x-admin-key'] = adminKey;
    await fetch(url, { method, headers, body: fd });
    setOpen(false); setSaving(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    await fetch(`${BASE_URL}/api/team/${id}`, { method: 'DELETE', headers: adminHeaders() });
    load();
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Team
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {members.length} team member{members.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Member
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#2BB5A8' }} /></Box>
      ) : (
        <TableContainer sx={{ border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Member', 'Role', 'Bio', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m._id} sx={TR}>
                  <TableCell sx={TD}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar src={m.image} sx={{ width: 36, height: 36, bgcolor: m.color || '#00B6AD', fontSize: '0.8rem', fontWeight: 800 }}>
                        {!m.image && (m.initials || m.name?.slice(0, 2).toUpperCase())}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ ...TD, color: '#7E8AA8' }}>{m.role || '—'}</TableCell>
                  <TableCell sx={{ ...TD, maxWidth: 260 }}>
                    <Typography sx={{ fontSize: '0.82rem', color: '#7E8AA8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {m.bio || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={TD}>
                    <Chip
                      label={m.active !== false ? 'Active' : 'Inactive'}
                      size="small"
                      sx={m.active !== false
                        ? { bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                        : { bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ ...TD, width: 48 }}>
                    <ActionsMenu items={[
                      { label: 'View',   icon: <VisibilityIcon sx={{ fontSize: 16 }} />, onClick: () => setView(m) },
                      { label: 'Edit',   icon: <EditIcon sx={{ fontSize: 16 }} />,       onClick: () => openEdit(m) },
                      { label: 'Delete', icon: <DeleteIcon sx={{ fontSize: 16 }} />,     onClick: () => remove(m._id), danger: true },
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
          Team Member
        </DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2} alignItems="center">
              <Avatar src={view.image} sx={{ width: 72, height: 72, bgcolor: view.color || '#00B6AD', fontSize: '1.4rem', fontWeight: 800 }}>
                {!view.image && (view.initials || view.name?.slice(0, 2).toUpperCase())}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography fontWeight={700} fontSize="1.1rem">{view.name}</Typography>
                <Typography variant="caption" color="text.secondary">{view.role}</Typography>
              </Box>
              <Divider sx={{ width: '100%' }} />
              {view.bio && (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bio</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: '0.9rem', color: '#3A4B70' }}>{view.bio}</Typography>
                </Box>
              )}
              <Stack direction="row" spacing={4} sx={{ width: '100%' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</Typography>
                  <Typography sx={{ mt: 0.5 }}>{view.active !== false ? 'Active' : 'Inactive'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order</Typography>
                  <Typography sx={{ mt: 0.5 }}>{view.order ?? 0}</Typography>
                </Box>
              </Stack>
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
          {editing ? 'Edit Member' : 'Add Member'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name *" value={form.name} onChange={set('name')} size="small" />
            <TextField label="Role" value={form.role} onChange={set('role')} size="small" />
            <TextField label="Bio" value={form.bio} onChange={set('bio')} multiline rows={3} size="small" />
            <TextField label="Initials (e.g. PH)" value={form.initials} onChange={set('initials')} size="small" />
            <TextField label="Accent Color" type="color" value={form.color} onChange={set('color')} size="small" />
            <TextField label="Order" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} size="small" />
            <FormControlLabel control={<Switch checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />} label="Active" />
            <Button variant="outlined" onClick={() => fileRef.current.click()} size="small">
              {imageFile ? imageFile.name : 'Upload Photo'}
            </Button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files[0])} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={save} disabled={saving || !form.name}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
