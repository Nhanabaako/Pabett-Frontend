import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Stack, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Switch, FormControlLabel, Avatar, IconButton,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Menu, MenuItem as MuiMenuItem,
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import MoreVertIcon   from '@mui/icons-material/MoreVert';
import EditIcon       from '@mui/icons-material/Edit';
import DeleteIcon     from '@mui/icons-material/Delete';
import LockResetIcon  from '@mui/icons-material/LockReset';
import ShieldIcon     from '@mui/icons-material/Shield';
import PersonIcon     from '@mui/icons-material/Person';
import { BASE_URL, adminHeaders } from '../../api/api';

const TH = {
  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: '#7E8AA8', py: 1.25, px: 2,
  whiteSpace: 'nowrap', bgcolor: '#F7FAF9', borderBottom: '1px solid #E2EBE9',
};
const TD = { py: 1.5, px: 2, fontSize: '0.875rem', verticalAlign: 'middle' };
const TR = { '&:last-child td': { borderBottom: 0 }, '&:hover td': { bgcolor: '#FAFCFC' } };

const ROLE_CHIP = {
  superadmin: { bgcolor: '#FEF3C7', color: '#92400E', label: 'Superadmin', icon: <ShieldIcon sx={{ fontSize: 12 }} /> },
  admin:      { bgcolor: '#E0F2FE', color: '#0C4A6E', label: 'Admin',      icon: <PersonIcon  sx={{ fontSize: 12 }} /> },
};

function ActionsMenu({ items }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreVertIcon sx={{ fontSize: 18, color: '#7E8AA8' }} />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 160 } }}>
        {items.map((item) => (
          <MuiMenuItem key={item.label} onClick={() => { item.onClick(); setAnchor(null); }}
            sx={{ fontSize: '0.85rem', gap: 1.5, color: item.danger ? '#C0392B' : 'inherit', py: 1 }}>
            {item.icon}{item.label}
          </MuiMenuItem>
        ))}
      </Menu>
    </>
  );
}

const EMPTY = { email: '', password: '', name: '', role: 'admin' };

export default function AdminsAdmin() {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editOpen,   setEditOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm,   setEditForm]   = useState({ name: '', role: 'admin', active: true });
  const [pwOpen,     setPwOpen]     = useState(false);
  const [pwTarget,   setPwTarget]   = useState(null);
  const [newPw,      setNewPw]      = useState('');
  const [pwSaving,   setPwSaving]   = useState(false);
  const [error,      setError]      = useState('');

  const myEmail = (() => {
    try { return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).email; } catch { return ''; }
  })();

  const load = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/superadmin/admins`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setAdmins).catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const create = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Email and password are required');
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/superadmin/admins`, {
        method: 'POST', headers: adminHeaders(), body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create admin'); return; }
      setOpen(false); setForm(EMPTY); load();
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const saveEdit = async () => {
    setSaving(true);
    await fetch(`${BASE_URL}/api/superadmin/admins/${editTarget}`, {
      method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(editForm),
    });
    setEditOpen(false); setSaving(false); load();
  };

  const savePw = async () => {
    if (newPw.length < 8) return;
    setPwSaving(true);
    await fetch(`${BASE_URL}/api/superadmin/admins/${pwTarget}/password`, {
      method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ password: newPw }),
    });
    setPwOpen(false); setNewPw(''); setPwSaving(false);
  };

  const deleteAdmin = async (id, email) => {
    if (!window.confirm(`Delete admin "${email}"? This cannot be undone.`)) return;
    await fetch(`${BASE_URL}/api/superadmin/admins/${id}`, { method: 'DELETE', headers: adminHeaders() });
    load();
  };

  const openEdit = (a) => {
    setEditTarget(a._id);
    setEditForm({ name: a.name || '', role: a.role, active: a.active !== false });
    setEditOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Admin Accounts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage who has access to this portal
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setError(''); setOpen(true); }}>
          Add Admin
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#2BB5A8' }} /></Box>
      ) : (
        <TableContainer sx={{ border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Account', 'Role', 'Status', 'Last Login', 'Created', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((a) => {
                const rc = ROLE_CHIP[a.role] || ROLE_CHIP.admin;
                const isMe = a.email === myEmail;
                return (
                  <TableRow key={a._id} sx={TR}>
                    <TableCell sx={TD}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: a.role === 'superadmin' ? '#FEF3C7' : '#E0F2FE', color: a.role === 'superadmin' ? '#92400E' : '#0C4A6E', fontSize: '0.78rem', fontWeight: 700 }}>
                          {(a.name || a.email)[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E2D4F', lineHeight: 1.2 }}>
                            {a.name || '—'} {isMe && <Chip label="You" size="small" sx={{ ml: 0.5, height: 16, fontSize: '0.6rem', bgcolor: '#E0F9F7', color: '#1F9A8E' }} />}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8' }}>{a.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={TD}>
                      <Chip icon={rc.icon} label={rc.label} size="small"
                        sx={{ bgcolor: rc.bgcolor, color: rc.color, fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }} />
                    </TableCell>
                    <TableCell sx={TD}>
                      <Chip label={a.active !== false ? 'Active' : 'Inactive'} size="small"
                        sx={a.active !== false
                          ? { bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                          : { bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ ...TD, color: '#7E8AA8', fontSize: '0.8rem' }}>
                      {a.lastLogin ? new Date(a.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                    </TableCell>
                    <TableCell sx={{ ...TD, color: '#7E8AA8', fontSize: '0.8rem' }}>
                      {new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell sx={{ ...TD, width: 48 }}>
                      <ActionsMenu items={[
                        { label: 'Edit',           icon: <EditIcon sx={{ fontSize: 16 }} />,      onClick: () => openEdit(a) },
                        { label: 'Reset Password', icon: <LockResetIcon sx={{ fontSize: 16 }} />, onClick: () => { setPwTarget(a._id); setNewPw(''); setPwOpen(true); } },
                        ...(!isMe ? [{ label: 'Delete', icon: <DeleteIcon sx={{ fontSize: 16 }} />, onClick: () => deleteAdmin(a._id, a.email), danger: true }] : []),
                      ]} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Add Admin Account
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Box sx={{ bgcolor: '#FEE2E2', color: '#991B1B', borderRadius: 1, px: 2, py: 1, fontSize: '0.875rem' }}>{error}</Box>}
            <TextField label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} size="small" />
            <TextField label="Email *" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} size="small" />
            <TextField label="Password *" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} size="small" helperText="Minimum 8 characters" />
            <FormControl size="small" fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">Superadmin</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={create} disabled={saving}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Edit Admin
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} size="small" />
            <FormControl size="small" fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={editForm.role} label="Role" onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">Superadmin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel control={<Switch checked={editForm.active} onChange={(e) => setEditForm((p) => ({ ...p, active: e.target.checked }))} />} label="Active" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={saveEdit} disabled={saving}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset password dialog */}
      <Dialog open={pwOpen} onClose={() => setPwOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="New Password" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
              size="small" helperText="Minimum 8 characters"
              error={newPw.length > 0 && newPw.length < 8} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setPwOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={savePw} disabled={pwSaving || newPw.length < 8}>
            {pwSaving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
