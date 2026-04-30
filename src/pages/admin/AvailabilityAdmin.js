import React, { useState, useEffect } from 'react';
import {
  Box, Stack, TextField, IconButton, CircularProgress, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel,
  Menu, MenuItem, Typography,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import AddIcon      from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon     from '@mui/icons-material/Edit';
import DeleteIcon   from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { BASE_URL, adminHeaders } from '../../api/api';

const TH = {
  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: '#7E8AA8', py: 1.25, px: 2,
  whiteSpace: 'nowrap', bgcolor: '#F7FAF9', borderBottom: '1px solid #E2EBE9',
};
const TD = { py: 1.625, px: 2, fontSize: '0.875rem', verticalAlign: 'middle', color: '#1E2D4F' };
const TR = { '&:last-child td': { borderBottom: 0 }, '&:hover td': { bgcolor: '#FAFCFC' } };

const DEFAULT_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

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

export default function AvailabilityAdmin() {
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({ date: '', label: '', times: [...DEFAULT_TIMES], closed: false });
  const [newTime, setNewTime] = useState('');

  const [editOpen,    setEditOpen]    = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [editForm,    setEditForm]    = useState({ label: '', times: [], closed: false });
  const [editNewTime, setEditNewTime] = useState('');
  const [editSaving,  setEditSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/availability/all`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setSlots).catch(() => setSlots([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const buildLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const openAdd = () => {
    setForm({ date: '', label: '', times: [...DEFAULT_TIMES], closed: false });
    setNewTime('');
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, label: form.label || buildLabel(form.date) };
    await fetch(`${BASE_URL}/api/availability`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(payload) });
    setOpen(false); setSaving(false); load();
  };

  const toggleClose = async (slot) => {
    await fetch(`${BASE_URL}/api/availability/${slot._id}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ closed: !slot.closed }) });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this date?')) return;
    await fetch(`${BASE_URL}/api/availability/${id}`, { method: 'DELETE', headers: adminHeaders() });
    load();
  };

  const addTime = () => {
    if (newTime && !form.times.includes(newTime)) {
      setForm((p) => ({ ...p, times: [...p.times, newTime].sort() }));
    }
    setNewTime('');
  };
  const removeTime = (t) => setForm((p) => ({ ...p, times: p.times.filter((x) => x !== t) }));

  const openEdit = (slot) => {
    setEditTarget(slot._id);
    setEditForm({ label: slot.label, times: [...(slot.times || [])], closed: slot.closed });
    setEditNewTime('');
    setEditOpen(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    await fetch(`${BASE_URL}/api/availability/${editTarget}`, {
      method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(editForm),
    });
    setEditOpen(false); setEditSaving(false); load();
  };

  const addEditTime = () => {
    if (editNewTime && !editForm.times.includes(editNewTime)) {
      setEditForm((p) => ({ ...p, times: [...p.times, editNewTime].sort() }));
    }
    setEditNewTime('');
  };
  const removeEditTime = (t) => setEditForm((p) => ({ ...p, times: p.times.filter((x) => x !== t) }));

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Availability
          </Typography>
          <Typography variant="body2" color="text.secondary">Manage bookable dates and time slots</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Date
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#2BB5A8' }} /></Box>
      ) : slots.length === 0 ? (
        <Box sx={{ background: '#fff', border: '1px solid #E2EBE9', borderRadius: '10px', p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">No availability set. Click "Add Date" to start.</Typography>
        </Box>
      ) : (
        <TableContainer sx={{ border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Date', 'Label', 'Time Slots', 'Booked', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.map((slot) => {
                const booked    = slot.booked?.length || 0;
                const total     = slot.times?.length  || 0;
                const available = total - booked;
                return (
                  <TableRow key={slot._id} sx={{ ...TR, opacity: slot.closed ? 0.65 : 1 }}>
                    <TableCell sx={{ ...TD, fontWeight: 600, whiteSpace: 'nowrap' }}>{slot.date}</TableCell>
                    <TableCell sx={TD}>{slot.label}</TableCell>
                    <TableCell sx={{ ...TD, maxWidth: 260 }}>
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {slot.times?.map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            size="small"
                            sx={slot.booked?.includes(t)
                              ? { bgcolor: '#FEE2E2', color: '#C0392B', border: '1px solid #FECACA', fontSize: '0.72rem', fontWeight: 600, borderRadius: '999px', height: 22 }
                              : { bgcolor: '#E0F9F7', color: '#1F9A8E', border: '1px solid #B2EBE8', fontSize: '0.72rem', fontWeight: 600, borderRadius: '999px', height: 22 }
                            }
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell sx={TD}>
                      <Typography sx={{ fontSize: '0.82rem', color: '#7E8AA8' }}>
                        {booked}/{total}
                      </Typography>
                      <Typography sx={{ color: '#059669', fontSize: '0.75rem' }}>{available} free</Typography>
                    </TableCell>
                    <TableCell sx={TD}>
                      <Chip
                        label={slot.closed ? 'Closed' : 'Open'}
                        size="small"
                        sx={slot.closed
                          ? { bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                          : { bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ ...TD, width: 48 }}>
                      <ActionsMenu items={[
                        { label: 'Edit',                          icon: <EditIcon sx={{ fontSize: 16 }} />,     onClick: () => openEdit(slot) },
                        { label: slot.closed ? 'Reopen' : 'Close', icon: <ToggleOnIcon sx={{ fontSize: 16 }} />, onClick: () => toggleClose(slot) },
                        { label: 'Delete',                        icon: <DeleteIcon sx={{ fontSize: 16 }} />,   onClick: () => remove(slot._id), danger: true },
                      ]} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Add Bookable Date
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Date *" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value, label: buildLabel(e.target.value) }))} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="Label (auto-filled)" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} size="small" helperText="e.g. Sat 3 May — shown to clients" />
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" mb={1} display="block">TIME SLOTS</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75} mb={1.5}>
                {form.times.map((t) => (
                  <Chip key={t} label={t} size="small" onDelete={() => removeTime(t)} sx={{ bgcolor: '#e8f5f5', color: '#00B6AD' }} />
                ))}
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} size="small" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                <Button onClick={addTime} variant="outlined" size="small" disabled={!newTime}>Add</Button>
              </Stack>
            </Box>
            <FormControlLabel control={<Switch checked={form.closed} onChange={(e) => setForm((p) => ({ ...p, closed: e.target.checked }))} />} label="Mark as closed" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={save} disabled={saving || !form.date}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Edit Date Slot
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Label" value={editForm.label} onChange={(e) => setEditForm((p) => ({ ...p, label: e.target.value }))} size="small" />
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" mb={1} display="block">TIME SLOTS</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75} mb={1.5}>
                {editForm.times.map((t) => (
                  <Chip key={t} label={t} size="small" onDelete={() => removeEditTime(t)} sx={{ bgcolor: '#e8f5f5', color: '#00B6AD' }} />
                ))}
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField type="time" value={editNewTime} onChange={(e) => setEditNewTime(e.target.value)} size="small" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                <Button onClick={addEditTime} variant="outlined" size="small" disabled={!editNewTime}>Add</Button>
              </Stack>
            </Box>
            <FormControlLabel control={<Switch checked={editForm.closed} onChange={(e) => setEditForm((p) => ({ ...p, closed: e.target.checked }))} />} label="Mark as closed" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={saveEdit} disabled={editSaving}>
            {editSaving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
