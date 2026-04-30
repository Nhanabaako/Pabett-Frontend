import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Stack, Chip, CircularProgress,
  Paper, Grid, Divider, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Alert,
} from '@mui/material';
import StorageIcon       from '@mui/icons-material/Storage';
import MemoryIcon        from '@mui/icons-material/Memory';
import AccessTimeIcon    from '@mui/icons-material/AccessTime';
import DownloadIcon      from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon       from '@mui/icons-material/Refresh';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import { BASE_URL, adminHeaders } from '../../api/api';

const STAT_CARD = { bgcolor: '#fff', border: '1px solid #E2EBE9', borderRadius: '12px', p: 3 };

const DELETABLE = [
  { key: 'bookings',     label: 'All Bookings',     color: '#2196f3' },
  { key: 'gallery',      label: 'All Gallery Images', color: '#e91e63' },
  { key: 'testimonials', label: 'All Testimonials',  color: '#f59e0b' },
  { key: 'availability', label: 'All Availability',  color: '#2BB5A8' },
  { key: 'logs',         label: 'All Audit Logs',    color: '#9c27b0' },
];

export default function SystemAdmin() {
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dangerKey, setDangerKey] = useState(null);
  const [deleting,  setDeleting]  = useState(false);
  const [success,   setSuccess]   = useState('');

  const load = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/superadmin/system`, { headers: adminHeaders() })
      .then((r) => r.json()).then(setStats).catch(() => setStats(null))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const exportData = async () => {
    setExporting(true);
    try {
      const res  = await fetch(`${BASE_URL}/api/superadmin/data/export`, { headers: adminHeaders() });
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `pabett-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { }
    setExporting(false);
  };

  const bulkDelete = async () => {
    if (!dangerKey) return;
    setDeleting(true);
    try {
      const res  = await fetch(`${BASE_URL}/api/superadmin/data/${dangerKey}`, { method: 'DELETE', headers: adminHeaders() });
      const data = await res.json();
      setSuccess(data.message || 'Deleted successfully');
      setTimeout(() => setSuccess(''), 4000);
      load();
    } catch { }
    setDeleting(false); setDangerKey(null);
  };

  const heapPct = stats ? Math.round((stats.server.memory.heapUsedMB / stats.server.memory.heapTotalMB) * 100) : 0;
  const dbCols  = stats?.database?.collections || {};
  const totalDocs = Object.values(dbCols).reduce((s, v) => s + v, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            System
          </Typography>
          <Typography variant="body2" color="text.secondary">Server health, data management and export</Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load} size="small">Refresh</Button>
          <Button variant="contained" startIcon={exporting ? null : <DownloadIcon />} onClick={exportData} disabled={exporting}>
            {exporting ? <><CircularProgress size={14} sx={{ color: '#fff', mr: 1 }} />Exporting…</> : 'Export All Data'}
          </Button>
        </Stack>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#2BB5A8' }} /></Box>
      ) : !stats ? (
        <Alert severity="error">Failed to load system stats.</Alert>
      ) : (
        <Stack spacing={3}>

          {/* ── Server Info ── */}
          <Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 500, color: '#1E2D4F', mb: 2 }}>
              Server
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={STAT_CARD}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <AccessTimeIcon sx={{ color: '#2BB5A8', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7E8AA8' }}>Uptime</Typography>
                  </Stack>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: '#1E2D4F', lineHeight: 1 }}>
                    {stats.server.uptimeHuman}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={STAT_CARD}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <MemoryIcon sx={{ color: '#9c27b0', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7E8AA8' }}>Heap Usage</Typography>
                  </Stack>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: '#1E2D4F', lineHeight: 1, mb: 1 }}>
                    {stats.server.memory.heapUsedMB} MB
                  </Typography>
                  <LinearProgress variant="determinate" value={heapPct}
                    sx={{ height: 4, borderRadius: 999, bgcolor: '#EDE9FE', '& .MuiLinearProgress-bar': { bgcolor: '#9c27b0' } }} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#7E8AA8', mt: 0.5 }}>of {stats.server.memory.heapTotalMB} MB ({heapPct}%)</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={STAT_CARD}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <StorageIcon sx={{ color: '#0891b2', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7E8AA8' }}>Database</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <CheckCircleIcon sx={{ color: '#059669', fontSize: 16 }} />
                    <Typography sx={{ fontWeight: 700, color: '#059669', fontSize: '0.9rem' }}>
                      {stats.database.status}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8' }}>{stats.database.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8' }}>{totalDocs.toLocaleString()} total documents</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={STAT_CARD}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#059669' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7E8AA8' }}>Environment</Typography>
                  </Stack>
                  <Chip label={stats.server.environment} size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, mb: 1 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8' }}>Node {stats.server.nodeVersion}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8' }}>RSS {stats.server.memory.rssMB} MB</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* ── Collection Counts ── */}
          <Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 500, color: '#1E2D4F', mb: 2 }}>
              Database Collections
            </Typography>
            <Paper sx={{ border: '1px solid #E2EBE9', borderRadius: '12px', overflow: 'hidden', bgcolor: '#fff' }}>
              {Object.entries(dbCols).map(([col, count], i, arr) => (
                <Box key={col}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 1.75 }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#1E2D4F', textTransform: 'capitalize', fontWeight: 500 }}>
                      {col}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 600, color: '#2BB5A8' }}>
                      {count.toLocaleString()}
                    </Typography>
                  </Stack>
                  {i < arr.length - 1 && <Divider sx={{ borderColor: '#E2EBE9' }} />}
                </Box>
              ))}
            </Paper>
          </Box>

          {/* ── Danger Zone ── */}
          <Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 500, color: '#C0392B', mb: 0.5 }}>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              These actions are permanent and cannot be undone. Use with extreme caution.
            </Typography>
            <Paper sx={{ border: '1px solid #FEE2E2', borderRadius: '12px', overflow: 'hidden', bgcolor: '#fff' }}>
              {DELETABLE.map((item, i, arr) => (
                <Box key={item.key}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E2D4F' }}>{item.label}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#7E8AA8' }}>
                        {dbCols[item.key]?.toLocaleString() ?? '—'} records · permanent delete
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => setDangerKey(item.key)}
                      sx={{ flexShrink: 0 }}
                    >
                      Delete All
                    </Button>
                  </Stack>
                  {i < arr.length - 1 && <Divider sx={{ borderColor: '#FEE2E2' }} />}
                </Box>
              ))}
            </Paper>
          </Box>
        </Stack>
      )}

      {/* Danger confirm dialog */}
      <Dialog open={Boolean(dangerKey)} onClose={() => setDangerKey(null)}>
        <DialogTitle sx={{ color: '#C0392B' }}>⚠️ Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to permanently delete <strong>all {DELETABLE.find((d) => d.key === dangerKey)?.label?.toLowerCase()}</strong>.
            This cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDangerKey(null)}>Cancel</Button>
          <Button onClick={bulkDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Yes, Delete All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
