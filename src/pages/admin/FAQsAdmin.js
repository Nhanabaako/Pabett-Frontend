import React, { useState, useEffect } from 'react';
import {
  Box, Stack, TextField, IconButton, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Switch,
  Menu, MenuItem, Typography, Divider,
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

const EMPTY = { question: '', answer: '', order: 0, visible: true };

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

export default function FAQsAdmin() {
  const [faqs,    setFaqs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [view,    setView]    = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/faqs`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setFaqs).catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (f) => {
    setEditing(f._id);
    setForm({ question: f.question, answer: f.answer, order: f.order || 0, visible: f.visible !== false });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const url = editing ? `${BASE_URL}/api/faqs/${editing}` : `${BASE_URL}/api/faqs`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: adminHeaders(), body: JSON.stringify(form) });
    setOpen(false); setSaving(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    await fetch(`${BASE_URL}/api/faqs/${id}`, { method: 'DELETE', headers: adminHeaders() });
    load();
  };

  const toggle = async (f) => {
    await fetch(`${BASE_URL}/api/faqs/${f._id}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ visible: !f.visible }) });
    load();
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            FAQs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {faqs.length} question{faqs.length !== 1 ? 's' : ''} published
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add FAQ
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
                {['#', 'Question', 'Answer', 'Visible', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {faqs.map((f, i) => (
                <TableRow key={f._id} sx={TR}>
                  <TableCell sx={{ ...TD, color: '#7E8AA8', fontSize: '0.8rem', width: 32 }}>{i + 1}</TableCell>
                  <TableCell sx={{ ...TD, maxWidth: 240 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {f.question}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ ...TD, maxWidth: 320 }}>
                    <Typography sx={{ fontSize: '0.82rem', color: '#7E8AA8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {f.answer}
                    </Typography>
                  </TableCell>
                  <TableCell sx={TD}>
                    <Switch
                      checked={f.visible !== false}
                      onChange={() => toggle(f)}
                      size="small"
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BB5A8' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2BB5A8' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...TD, width: 48 }}>
                    <ActionsMenu items={[
                      { label: 'View',   icon: <VisibilityIcon sx={{ fontSize: 16 }} />, onClick: () => setView(f) },
                      { label: 'Edit',   icon: <EditIcon sx={{ fontSize: 16 }} />,       onClick: () => openEdit(f) },
                      { label: f.visible !== false ? 'Hide' : 'Show', icon: <ToggleOnIcon sx={{ fontSize: 16 }} />, onClick: () => toggle(f) },
                      { label: 'Delete', icon: <DeleteIcon sx={{ fontSize: 16 }} />,     onClick: () => remove(f._id), danger: true },
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
          FAQ Details
        </DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Question</Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 600 }}>{view.question}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Answer</Typography>
                <Typography sx={{ mt: 0.5, fontSize: '0.9rem', color: '#3A4B70' }}>{view.answer}</Typography>
              </Box>
              <Divider />
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order</Typography>
                  <Typography sx={{ mt: 0.5 }}>{view.order ?? 0}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visible</Typography>
                  <Typography sx={{ mt: 0.5 }}>{view.visible !== false ? 'Yes' : 'No'}</Typography>
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
          {editing ? 'Edit FAQ' : 'Add FAQ'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Question *" value={form.question} onChange={set('question')} size="small" />
            <TextField label="Answer *" value={form.answer} onChange={set('answer')} multiline rows={4} size="small" />
            <TextField label="Order" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} size="small" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={save} disabled={saving || !form.question || !form.answer}>
            {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
