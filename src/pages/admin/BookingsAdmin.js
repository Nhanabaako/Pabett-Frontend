import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Stack, Select, MenuItem, FormControl, InputLabel, InputAdornment,
  CircularProgress, IconButton, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, TextField, Grid, Menu, Typography, Divider, Chip,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import CancelIcon       from '@mui/icons-material/Cancel';
import MoreVertIcon     from '@mui/icons-material/MoreVert';
import VisibilityIcon   from '@mui/icons-material/Visibility';
import EditIcon         from '@mui/icons-material/Edit';
import DeleteIcon       from '@mui/icons-material/Delete';
import AddIcon          from '@mui/icons-material/Add';
import RefreshIcon      from '@mui/icons-material/Refresh';
import PersonIcon       from '@mui/icons-material/Person';
import EmailIcon        from '@mui/icons-material/Email';
import PhoneIcon        from '@mui/icons-material/Phone';
import EventIcon        from '@mui/icons-material/EventAvailable';
import TimeIcon         from '@mui/icons-material/AccessTime';
import LocationIcon     from '@mui/icons-material/LocationOn';
import { BASE_URL, adminHeaders } from '../../api/api';

const TH = {
  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: '#7E8AA8', py: 1.25, px: 2,
  whiteSpace: 'nowrap', bgcolor: '#F7FAF9', borderBottom: '1px solid #E2EBE9',
};
const TD = { py: 1.625, px: 2, fontSize: '0.875rem', verticalAlign: 'middle', color: '#1E2D4F' };
const TR = { '&:last-child td': { borderBottom: 0 }, '&:hover td': { bgcolor: '#FAFCFC' } };

const BADGE_COLORS = {
  pending:       { bgcolor: '#FEF3C7', color: '#92400E' },
  confirmed:     { bgcolor: '#D1FAE5', color: '#065F46' },
  cancelled:     { bgcolor: '#FEE2E2', color: '#991B1B' },
  'in-studio':   { bgcolor: '#E0F2FE', color: '#0C4A6E' },
  'on-location': { bgcolor: '#FFF7ED', color: '#9A3412' },
};

function BadgeChip({ value }) {
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        ...(BADGE_COLORS[value] || { bgcolor: '#F1F5F9', color: '#64748B' }),
        fontWeight: 700, fontSize: '0.68rem',
        textTransform: 'capitalize', borderRadius: '999px', height: 22,
      }}
    />
  );
}

const PRIMARY = '#00B6AD';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '&:hover fieldset': { borderColor: PRIMARY },
    '&.Mui-focused fieldset': { borderColor: PRIMARY, borderWidth: '2px' },
  },
  '& label.Mui-focused': { color: PRIMARY },
};

const SectionLabel = ({ children }) => (
  <Grid item xs={12}>
    <Typography variant="caption" sx={{
      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      color: '#7E8AA8', display: 'block', mb: -0.5, mt: 0.5,
    }}>
      {children}
    </Typography>
  </Grid>
);

const EMPTY_BOOKING = {
  fullName: '', email: '', phone: '',
  service1: '', service2: '',
  appointmentType: 'in-studio', location: 'In-Studio',
  date: '', time: '', occasion: '', notes: '', status: 'pending',
};

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
        PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 160 } }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => { item.onClick(); setAnchor(null); }}
            sx={{ fontSize: '0.85rem', gap: 1.5, color: item.danger ? '#C0392B' : item.success ? '#059669' : item.warning ? '#D97706' : 'inherit', py: 1 }}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function BookingForm({ form, set }) {
  return (
    <Grid container spacing={2} mt={0.5}>

      {/* ── Contact Info ── */}
      <SectionLabel>Contact Info</SectionLabel>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Full Name *" value={form.fullName} onChange={set('fullName')}
          size="small" fullWidth sx={inputSx}
          InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 17, color: PRIMARY }} /></InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Email *" value={form.email} onChange={set('email')}
          size="small" fullWidth sx={inputSx}
          InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 17, color: PRIMARY }} /></InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Phone *" value={form.phone} onChange={set('phone')}
          size="small" fullWidth sx={inputSx}
          InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 17, color: PRIMARY }} /></InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl size="small" fullWidth sx={inputSx}>
          <InputLabel>Status</InputLabel>
          <Select value={form.status} label="Status" onChange={set('status')}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* ── Service ── */}
      <SectionLabel>Service</SectionLabel>
      <Grid item xs={12} sm={6}>
        <TextField label="Primary Service *" value={form.service1} onChange={set('service1')} size="small" fullWidth sx={inputSx} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Add-on Service (optional)" value={form.service2} onChange={set('service2')} size="small" fullWidth sx={inputSx} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl size="small" fullWidth sx={inputSx}>
          <InputLabel>Appointment Type *</InputLabel>
          <Select value={form.appointmentType} label="Appointment Type *" onChange={set('appointmentType')}>
            <MenuItem value="in-studio">In-Studio</MenuItem>
            <MenuItem value="on-location">On-Location</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Location / Address" value={form.location} onChange={set('location')}
          size="small" fullWidth sx={inputSx}
          InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ fontSize: 17, color: '#ff9800' }} /></InputAdornment> }}
        />
      </Grid>

      {/* ── Schedule ── */}
      <SectionLabel>Schedule</SectionLabel>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Date *" type="date" value={form.date} onChange={set('date')}
          size="small" fullWidth InputLabelProps={{ shrink: true }} sx={inputSx}
          InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon sx={{ fontSize: 17, color: PRIMARY }} /></InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Time *" type="time" value={form.time} onChange={set('time')}
          size="small" fullWidth InputLabelProps={{ shrink: true }} sx={inputSx}
          InputProps={{ startAdornment: <InputAdornment position="start"><TimeIcon sx={{ fontSize: 17, color: PRIMARY }} /></InputAdornment> }}
        />
      </Grid>

      {/* ── Extra ── */}
      <SectionLabel>Additional Details</SectionLabel>
      <Grid item xs={12} sm={6}>
        <TextField label="Occasion" value={form.occasion} onChange={set('occasion')} size="small" fullWidth sx={inputSx} placeholder="e.g. Wedding, Birthday" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Notes" value={form.notes} onChange={set('notes')} size="small" fullWidth multiline rows={2} sx={inputSx} placeholder="Special requests or notes" />
      </Grid>
    </Grid>
  );
}

export default function BookingsAdmin() {
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId,    setTargetId]    = useState(null);

  const [view,       setView]       = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_BOOKING);
  const [creating,   setCreating]   = useState(false);
  const [editOpen,   setEditOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm,   setEditForm]   = useState(EMPTY_BOOKING);
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const q = filter ? `?status=${filter}` : '';
    fetch(`${BASE_URL}/api/booking${q}`, { headers: adminHeaders() })
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || d))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await fetch(`${BASE_URL}/api/booking/${id}/status`, {
      method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ status }),
    });
    load();
  };

  const deleteBooking = async () => {
    if (!targetId) return;
    await fetch(`${BASE_URL}/api/booking/${targetId}`, { method: 'DELETE', headers: adminHeaders() });
    setConfirmOpen(false); setTargetId(null);
    load();
  };

  const askDelete = (id) => { setTargetId(id); setConfirmOpen(true); };

  const openCreate = () => { setCreateForm(EMPTY_BOOKING); setCreateOpen(true); };
  const createBooking = async () => {
    setCreating(true);
    try {
      await fetch(`${BASE_URL}/api/booking`, {
        method: 'POST', headers: adminHeaders(), body: JSON.stringify(createForm),
      });
      setCreateOpen(false); load();
    } catch (_) {}
    setCreating(false);
  };

  const openEdit = (b) => {
    setEditTarget(b._id);
    setEditForm({
      fullName: b.fullName, email: b.email, phone: b.phone,
      service1: b.service1, service2: b.service2 || '',
      appointmentType: b.appointmentType, location: b.location || 'In-Studio',
      date: b.date, time: b.time, occasion: b.occasion || '',
      notes: b.notes || '', status: b.status || 'pending',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      await fetch(`${BASE_URL}/api/booking/${editTarget}`, {
        method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(editForm),
      });
      setEditOpen(false); load();
    } catch (_) {}
    setEditSaving(false);
  };

  const setC = (k) => (e) => setCreateForm((p) => ({ ...p, [k]: e.target.value }));
  const setE = (k) => (e) => setEditForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bookings.length} total appointment{bookings.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select value={filter} label="Filter Status" onChange={(e) => setFilter(e.target.value)}
              sx={{ borderRadius: '8px', background: '#fff' }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton onClick={load} sx={{ border: '1px solid #E2EBE9', borderRadius: '8px', bgcolor: '#fff' }}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add Booking
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2BB5A8' }} />
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ background: '#fff', border: '1px solid #E2EBE9', borderRadius: '10px', p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">No bookings found.</Typography>
        </Box>
      ) : (
        <TableContainer sx={{ border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Client', 'Service', 'Date & Time', 'Type', 'Contact', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={TH}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id} sx={TR}>
                  <TableCell sx={{ ...TD, fontWeight: 600 }}>{b.fullName}</TableCell>
                  <TableCell sx={{ ...TD, fontSize: '0.8rem' }}>
                    {b.service1}{b.service2 ? ` + ${b.service2}` : ''}
                  </TableCell>
                  <TableCell sx={TD}>
                    <Typography sx={{ fontSize: '0.85rem' }}>{b.date}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8' }}>{b.time}</Typography>
                  </TableCell>
                  <TableCell sx={TD}>
                    <BadgeChip value={b.appointmentType === 'on-location' ? 'on-location' : 'in-studio'} />
                  </TableCell>
                  <TableCell sx={TD}>
                    <Typography sx={{ fontSize: '0.78rem' }}>{b.email || '—'}</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#7E8AA8' }}>{b.phone}</Typography>
                  </TableCell>
                  <TableCell sx={TD}>
                    <BadgeChip value={b.status || 'pending'} />
                  </TableCell>
                  <TableCell sx={{ ...TD, width: 48 }}>
                    <ActionsMenu items={[
                      { label: 'View',    icon: <VisibilityIcon sx={{ fontSize: 16 }} />, onClick: () => setView(b) },
                      { label: 'Edit',    icon: <EditIcon sx={{ fontSize: 16 }} />,       onClick: () => openEdit(b) },
                      ...(b.status !== 'confirmed' ? [{ label: 'Confirm', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, onClick: () => updateStatus(b._id, 'confirmed'), success: true }] : []),
                      ...(b.status !== 'cancelled' ? [{ label: 'Cancel',  icon: <CancelIcon sx={{ fontSize: 16 }} />,      onClick: () => updateStatus(b._id, 'cancelled'), warning: true }] : []),
                      { label: 'Delete',  icon: <DeleteIcon sx={{ fontSize: 16 }} />,     onClick: () => askDelete(b._id), danger: true },
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
          Booking Details
        </DialogTitle>
        <DialogContent>
          {view && (
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700} fontSize="1rem">{view.fullName}</Typography>
                <BadgeChip value={view.status || 'pending'} />
              </Stack>
              <Divider />
              <Grid container spacing={2}>
                {[
                  { label: 'Email',    value: view.email },
                  { label: 'Phone',    value: view.phone },
                  { label: 'Service',  value: view.service1 + (view.service2 ? ` + ${view.service2}` : '') },
                  { label: 'Type',     value: view.appointmentType },
                  { label: 'Date',     value: view.date },
                  { label: 'Time',     value: view.time },
                  { label: 'Location', value: view.location },
                  ...(view.occasion ? [{ label: 'Occasion', value: view.occasion }] : []),
                ].map(({ label, value }) => (
                  <Grid item xs={6} key={label}>
                    <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</Typography>
                    <Typography sx={{ mt: 0.25, fontSize: '0.875rem' }}>{value || '—'}</Typography>
                  </Grid>
                ))}
              </Grid>
              {view.notes && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7E8AA8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</Typography>
                    <Typography sx={{ mt: 0.5, fontSize: '0.875rem', color: '#3A4B70' }}>{view.notes}</Typography>
                  </Box>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setView(null)}>Close</Button>
          <Button size="small" variant="contained" onClick={() => { openEdit(view); setView(null); }}>Edit</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Booking?</DialogTitle>
        <DialogContent><DialogContentText>This action cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={deleteBooking} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Add Booking
        </DialogTitle>
        <DialogContent>
          <BookingForm form={createForm} set={setC} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button size="small" variant="outlined" onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={createBooking}
            disabled={creating || !createForm.fullName || !createForm.email || !createForm.phone || !createForm.service1 || !createForm.date || !createForm.time}>
            {creating ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500 }}>
          Edit Booking
        </DialogTitle>
        <DialogContent>
          <BookingForm form={editForm} set={setE} />
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
