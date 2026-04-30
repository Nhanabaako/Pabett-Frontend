import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Stack, TextField, Grid,
  CircularProgress, Divider, Chip, Alert, Button, Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { BASE_URL, adminHeaders } from '../../api/api';

const EMPTY = { studioAddress: '', hoursOpen: '', hoursTime: '', phone: '', whatsapp: '', email: '', instagram: '', facebook: '', tiktok: '' };

export default function SettingsAdmin() {
  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/settings`)
      .then((r) => r.json())
      .then((d) => setForm({ studioAddress: d.studioAddress || '', hoursOpen: d.hoursOpen || '', hoursTime: d.hoursTime || '', phone: d.phone || '', whatsapp: d.whatsapp || '', email: d.email || '', instagram: d.instagram || '', facebook: d.facebook || '', tiktok: d.tiktok || '' }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false);
    await fetch(`${BASE_URL}/api/settings`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(form) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#00B6AD' }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Site Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">Contact info, opening hours, and social links</Typography>
        </Box>
        <Button variant="contained" startIcon={saving ? null : <SaveIcon />} onClick={save} disabled={saving}>
          {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Save Changes'}
        </Button>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Settings saved successfully!</Alert>}

      <Paper sx={{ p: 4, borderRadius: '10px', border: '1px solid #E2EBE9', boxShadow: 'none' }}>
        <Stack spacing={4}>
          <Box>
            <Chip label="STUDIO INFO" size="small" sx={{ bgcolor: '#E0F9F7', color: '#1F9A8E', fontWeight: 700, mb: 2, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }} />
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Studio Address" value={form.studioAddress} onChange={set('studioAddress')} size="small" /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Hours (days, e.g. Mon – Sat)" value={form.hoursOpen} onChange={set('hoursOpen')} size="small" /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Hours (time, e.g. 09:00 – 18:00)" value={form.hoursTime} onChange={set('hoursTime')} size="small" /></Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: '#E2EBE9' }} />

          <Box>
            <Chip label="CONTACT" size="small" sx={{ bgcolor: '#E0F9F7', color: '#1F9A8E', fontWeight: 700, mb: 2, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={form.phone} onChange={set('phone')} size="small" placeholder="+233 57 190 1526" /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="WhatsApp (digits only)" value={form.whatsapp} onChange={set('whatsapp')} size="small" placeholder="233571901526" /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Email" value={form.email} onChange={set('email')} size="small" /></Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: '#E2EBE9' }} />

          <Box>
            <Chip label="SOCIAL LINKS" size="small" sx={{ bgcolor: '#E0F9F7', color: '#1F9A8E', fontWeight: 700, mb: 2, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Instagram URL" value={form.instagram} onChange={set('instagram')} size="small" /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Facebook URL" value={form.facebook} onChange={set('facebook')} size="small" /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="TikTok URL" value={form.tiktok} onChange={set('tiktok')} size="small" /></Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
