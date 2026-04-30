import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Stack, Chip, CircularProgress,
  TextField, Select, MenuItem, FormControl, InputLabel,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Tooltip, IconButton,
} from '@mui/material';
import RefreshIcon    from '@mui/icons-material/Refresh';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';
import { BASE_URL, adminHeaders } from '../../api/api';

const TH = {
  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: '#7E8AA8', py: 1.25, px: 2,
  whiteSpace: 'nowrap', bgcolor: '#F7FAF9', borderBottom: '1px solid #E2EBE9',
};
const TD = { py: 1.375, px: 2, fontSize: '0.825rem', verticalAlign: 'middle' };
const TR = { '&:last-child td': { borderBottom: 0 }, '&:hover td': { bgcolor: '#FAFCFC' } };

const ACTION_COLORS = {
  LOGIN:   { bgcolor: '#D1FAE5', color: '#065F46' },
  CREATE:  { bgcolor: '#E0F2FE', color: '#0C4A6E' },
  UPDATE:  { bgcolor: '#FEF3C7', color: '#92400E' },
  DELETE:  { bgcolor: '#FEE2E2', color: '#991B1B' },
  EXPORT:  { bgcolor: '#EDE9FE', color: '#5B21B6' },
  SYSTEM:  { bgcolor: '#F0F9FF', color: '#0369A1' },
  CLEAR:   { bgcolor: '#FFF7ED', color: '#9A3412' },
};

const ALL_ACTIONS = ['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'SYSTEM', 'CLEAR'];

export default function AuditLogs() {
  const [logs,       setLogs]       = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [action,     setAction]     = useState('');
  const [resource,   setResource]   = useState('');
  const [emailQ,     setEmailQ]     = useState('');
  const [clearOpen,  setClearOpen]  = useState(false);
  const [clearing,   setClearing]   = useState(false);

  const LIMIT = 50;

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (action)   params.set('action',     action);
    if (resource) params.set('resource',   resource);
    if (emailQ)   params.set('adminEmail', emailQ);

    fetch(`${BASE_URL}/api/superadmin/logs?${params}`, { headers: adminHeaders() })
      .then((r) => r.json())
      .then((d) => { setLogs(d.logs || []); setTotal(d.total || 0); })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [page, action, resource, emailQ]);

  useEffect(() => { load(); }, [load]);

  const clearLogs = async () => {
    setClearing(true);
    await fetch(`${BASE_URL}/api/superadmin/logs`, { method: 'DELETE', headers: adminHeaders() });
    setClearing(false); setClearOpen(false); setPage(1); load();
  };

  const fmtDate = (d) => new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Audit Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total.toLocaleString()} total events recorded
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => { setPage(1); load(); }} sx={{ border: '1px solid #E2EBE9', borderRadius: '8px', bgcolor: '#fff' }}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" color="error" startIcon={<DeleteSweepIcon />} onClick={() => setClearOpen(true)}>
            Clear All Logs
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="flex-end">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Action</InputLabel>
          <Select value={action} label="Action" onChange={(e) => { setAction(e.target.value); setPage(1); }}>
            <MenuItem value="">All Actions</MenuItem>
            {ALL_ACTIONS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Resource" size="small" value={resource} sx={{ minWidth: 140 }}
          onChange={(e) => { setResource(e.target.value); setPage(1); }} placeholder="booking, admin…" />
        <TextField label="Admin Email" size="small" value={emailQ} sx={{ minWidth: 200 }}
          onChange={(e) => { setEmailQ(e.target.value); setPage(1); }} placeholder="Search by email…" />
        <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => { setAction(''); setResource(''); setEmailQ(''); setPage(1); }} size="small">
          Clear Filters
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#2BB5A8' }} /></Box>
      ) : logs.length === 0 ? (
        <Box sx={{ bgcolor: '#fff', border: '1px solid #E2EBE9', borderRadius: '10px', p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">No logs found.</Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Timestamp', 'Admin', 'Action', 'Resource', 'Details', 'Status', 'IP'].map((h) => (
                    <TableCell key={h} sx={TH}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => {
                  const ac = ACTION_COLORS[log.action] || { bgcolor: '#F1F5F9', color: '#64748B' };
                  return (
                    <TableRow key={log._id} sx={TR}>
                      <TableCell sx={{ ...TD, whiteSpace: 'nowrap', color: '#7E8AA8', fontSize: '0.75rem' }}>
                        {fmtDate(log.createdAt)}
                      </TableCell>
                      <TableCell sx={TD}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2D4F', lineHeight: 1.2 }}>
                          {log.adminEmail || '—'}
                        </Typography>
                        {log.role && (
                          <Typography sx={{ fontSize: '0.68rem', color: '#7E8AA8' }}>{log.role}</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={TD}>
                        <Chip label={log.action} size="small"
                          sx={{ ...ac, fontWeight: 700, fontSize: '0.65rem', borderRadius: '999px', height: 20 }} />
                      </TableCell>
                      <TableCell sx={{ ...TD, color: '#7E8AA8' }}>
                        {log.resource || '—'}{log.resourceId ? ` · ${log.resourceId.slice(-6)}` : ''}
                      </TableCell>
                      <TableCell sx={{ ...TD, maxWidth: 220 }}>
                        {log.details ? (
                          <Typography sx={{ fontSize: '0.75rem', color: '#7E8AA8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {JSON.stringify(log.details)}
                          </Typography>
                        ) : '—'}
                      </TableCell>
                      <TableCell sx={TD}>
                        <Chip label={log.status || 'success'} size="small"
                          sx={log.status === 'failure'
                            ? { bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, fontSize: '0.65rem', borderRadius: '999px', height: 20 }
                            : { bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.65rem', borderRadius: '999px', height: 20 }
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ ...TD, color: '#7E8AA8', fontSize: '0.75rem' }}>{log.ip || '—'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mt={3}>
              <Button size="small" variant="outlined" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Typography variant="body2" color="text.secondary">Page {page} of {totalPages}</Typography>
              <Button size="small" variant="outlined" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </Stack>
          )}
        </>
      )}

      {/* Clear confirm */}
      <Dialog open={clearOpen} onClose={() => setClearOpen(false)}>
        <DialogTitle>Clear All Audit Logs?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete all {total.toLocaleString()} log entries. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearOpen(false)}>Cancel</Button>
          <Button onClick={clearLogs} color="error" variant="contained" disabled={clearing}>
            {clearing ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : 'Clear All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
