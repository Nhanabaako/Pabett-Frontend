import React, { useState } from 'react';
import { Box, Drawer, IconButton, Avatar, Typography, Stack, Tooltip, Chip } from '@mui/material';
import MenuIcon   from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../pages/admin/Sidebar';

const DRAWER_WIDTH = 240;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminKey');
    localStorage.removeItem('adminRole');
    navigate('/admin/login', { replace: true });
  };

  const { adminEmail, adminRole } = (() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { adminEmail: 'Admin', adminRole: 'admin' };
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { adminEmail: payload.email || 'Admin', adminRole: payload.role || 'admin' };
    } catch {
      return { adminEmail: 'Admin', adminRole: 'admin' };
    }
  })();

  const isSuperAdmin = adminRole === 'superadmin';
  const initial      = adminEmail[0]?.toUpperCase() || 'A';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F0F4F3' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: { sm: DRAWER_WIDTH },
          right: 0,
          height: 60,
          bgcolor: '#fff',
          borderBottom: '1px solid #E2EBE9',
          zIndex: (t) => t.zIndex.drawer + 1,
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ display: { sm: 'none' }, color: '#1E2D4F' }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#1E2D4F',
              letterSpacing: 0,
            }}
          >
            Pabett Beauty
          </Typography>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7E8AA8',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            / Admin
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Stack direction="row" alignItems="center" spacing={0.75} justifyContent="flex-end">
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2D4F', lineHeight: 1.2 }}>
                {adminEmail}
              </Typography>
              {isSuperAdmin && (
                <Chip
                  icon={<ShieldIcon sx={{ fontSize: '10px !important', color: '#92400E !important' }} />}
                  label="SA"
                  size="small"
                  sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 800, fontSize: '0.58rem', height: 18, '& .MuiChip-label': { px: 0.5 } }}
                />
              )}
            </Stack>
            <Typography sx={{ fontSize: '0.65rem', color: '#7E8AA8', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isSuperAdmin ? 'Superadmin' : 'Administrator'}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: isSuperAdmin ? '#92400E' : '#2BB5A8',
              width: 34, height: 34,
              fontSize: '0.875rem', fontWeight: 800,
            }}
          >
            {initial}
          </Avatar>
          <Tooltip title="Sign out">
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: '#C0392B',
                border: '1px solid #FEE2E2',
                borderRadius: '8px',
                p: '6px',
                '&:hover': { bgcolor: '#FEE2E2' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* ── Sidebar — mobile ──────────────────────────────────────────────── */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* ── Sidebar — desktop ─────────────────────────────────────────────── */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
        open
      >
        <Sidebar />
      </Drawer>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '60px',
          p: { xs: 2, md: '28px 32px' },
          minWidth: 0,
          minHeight: 'calc(100vh - 60px)',
          bgcolor: '#F0F4F3',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
