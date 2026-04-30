import React, { useState, useEffect } from 'react';
import {
  Box, Stack, TextField, IconButton, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem, Typography, Divider,
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

const EMPTY = { year: '', event: '', order: 0 };

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

export default function MilestonesAdmin() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [view,    setView]    = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/milestones`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setItems).catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (m) => {
    setEditing(m._id);
    setForm({ year: m.year, event: m.event, order: m.order || 0 });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const url = editing ? `${BASE_URL}/api/milestones/${editing}` : `${BASE_URL}/api/milestones`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: adminHeaders(), body: JSON.stringify(form) });
    setOpen(false); setSaving(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this milestone?')) return;
    await fetch(`${BASE_URL}/api/milestones/${id}`, { method: 'DELETE', headers: adminHeaders() });
    load();
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Milestones
          </Typography>
          <Typography variant="body2" color="text.secondary">About page timeline</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Milestone
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
                {['Year', 'Event', 'Order', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((m) => (
                <TableRow key={m._id} sx={TR}>
                  <TableCell sx={{ ...TD, width: 80 }}>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 600, color: '#2BB5A8' }}>
                      {m.year}
                    </Typography>
                  </TableCell>
                  <TableCell sx={TD}>{m.event}</TableCell>
                  <TableCell sx={{ ...TD, fontSize: '0.8rem', color: '#7E8AA8', width: 60 }}>{m.order}</TableCell>
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
      <Dialog open={Boolean(view)} onClose={() => setView(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Milestone
        </DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Year</Typography>
                <Typography sx={{ mt: 0.5, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2BB5A8' }}>{view.year}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Event</Typography>
                <Typography sx={{ mt: 0.5, fontSize: '0.9rem', color: '#3A4B70' }}>{view.event}</Typography>
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          {editing ? 'Edit Milestone' : 'Add Milestone'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Year *" value={form.year} onChange={set('year')} size="small" placeholder="2016" />
            <TextField label="Event *" value={form.event} onChange={set('event')} multiline rows={2} size="small" placeholder="Pabett Beauty founded…" />
            <TextField label="Order" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} size="small" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={save} disabled={saving || !form.year || !form.event}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
