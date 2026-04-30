import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon      from '@mui/icons-material/Dashboard';
import InventoryIcon      from '@mui/icons-material/Inventory';
import CollectionsIcon    from '@mui/icons-material/Collections';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BookOnlineIcon     from '@mui/icons-material/BookOnline';
import SpaIcon            from '@mui/icons-material/Spa';
import StarIcon           from '@mui/icons-material/Star';
import GroupIcon          from '@mui/icons-material/Group';
import HelpIcon           from '@mui/icons-material/Help';
import EmojiEventsIcon    from '@mui/icons-material/EmojiEvents';
import SettingsIcon       from '@mui/icons-material/Settings';
import ShieldIcon         from '@mui/icons-material/Shield';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ReceiptLongIcon    from '@mui/icons-material/ReceiptLong';
import DnsIcon            from '@mui/icons-material/Dns';

const NAV = [
  { label: 'Dashboard',    path: '/admin/dashboard',    icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
  { divider: true, group: 'Scheduling' },
  { label: 'Bookings',     path: '/admin/bookings',     icon: <BookOnlineIcon sx={{ fontSize: 18 }} /> },
  { label: 'Availability', path: '/admin/availability', icon: <EventAvailableIcon sx={{ fontSize: 18 }} /> },
  { divider: true, group: 'Content' },
  { label: 'Products',     path: '/admin/products',     icon: <InventoryIcon sx={{ fontSize: 18 }} /> },
  { label: 'Gallery',      path: '/admin/gallery',      icon: <CollectionsIcon sx={{ fontSize: 18 }} /> },
  { label: 'Services',     path: '/admin/services',     icon: <SpaIcon sx={{ fontSize: 18 }} /> },
  { divider: true, group: 'Studio' },
  { label: 'Testimonials', path: '/admin/testimonials', icon: <StarIcon sx={{ fontSize: 18 }} /> },
  { label: 'Team',         path: '/admin/team',         icon: <GroupIcon sx={{ fontSize: 18 }} /> },
  { label: 'FAQs',         path: '/admin/faqs',         icon: <HelpIcon sx={{ fontSize: 18 }} /> },
  { label: 'Milestones',   path: '/admin/milestones',   icon: <EmojiEventsIcon sx={{ fontSize: 18 }} /> },
  { divider: true },
  { label: 'Settings',     path: '/admin/settings',     icon: <SettingsIcon sx={{ fontSize: 18 }} /> },
];

const SUPERADMIN_NAV = [
  { label: 'Admins',     path: '/admin/superadmin/admins', icon: <ManageAccountsIcon sx={{ fontSize: 18 }} />, superadmin: true },
  { label: 'Audit Logs', path: '/admin/superadmin/logs',   icon: <ReceiptLongIcon sx={{ fontSize: 18 }} />,    superadmin: true },
  { label: 'System',     path: '/admin/superadmin/system', icon: <DnsIcon sx={{ fontSize: 18 }} />,            superadmin: true },
];

export default function Sidebar() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const isSuperAdmin = localStorage.getItem('adminRole') === 'superadmin';

  const allNav = isSuperAdmin ? SUPERADMIN_NAV : NAV;

  return (
    <Box sx={{ width: 240, minHeight: '100vh', bgcolor: '#1E2D4F', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Brand */}
      <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.375rem', fontWeight: 500, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Pabett
          </Typography>
          {isSuperAdmin && (
            <Chip
              label="SA"
              size="small"
              icon={<ShieldIcon sx={{ fontSize: '10px !important', color: '#92400E !important' }} />}
              sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 800, fontSize: '0.58rem', height: 18, px: 0.25, '& .MuiChip-label': { px: 0.5 } }}
            />
          )}
        </Box>
        <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', mt: 0.5 }}>
          {isSuperAdmin ? 'Superadmin Portal' : 'Admin Portal'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      <List sx={{ flex: 1, pt: 1.5, pb: 2 }}>
        {allNav.map((item, i) => {
          if (item.divider) {
            const isSuperSection = item.superadmin;
            return (
              <Box key={i}>
                {item.group && (
                  <Typography sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: isSuperSection ? 'rgba(253,213,47,0.55)' : 'rgba(255,255,255,0.28)',
                    px: 3, pt: 2, pb: 0.75, display: 'flex', alignItems: 'center', gap: 0.75,
                  }}>
                    {isSuperSection && <ShieldIcon sx={{ fontSize: 10 }} />}
                    {item.group}
                  </Typography>
                )}
                {!item.group && <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', my: 0.75, mx: 2 }} />}
              </Box>
            );
          }

          const active = pathname === item.path || pathname.startsWith(item.path + '/');
          const isSA   = item.superadmin;

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={active}
              sx={{
                mx: 1.5, borderRadius: '8px', mb: 0.25, px: 1.5, py: 0.875,
                color: active ? '#fff' : isSA ? 'rgba(253,213,47,0.65)' : 'rgba(255,255,255,0.58)',
                borderLeft: active
                  ? `3px solid ${isSA ? '#FDE73F' : '#2BB5A8'}`
                  : '3px solid transparent',
                '&:hover': {
                  bgcolor: isSA ? 'rgba(253,213,47,0.08)' : 'rgba(255,255,255,0.07)',
                  color: isSA ? '#FDE73F' : '#fff',
                },
                '&.Mui-selected': {
                  bgcolor: isSA ? 'rgba(253,213,47,0.12)' : 'rgba(43,181,168,0.15)',
                  '&:hover': { bgcolor: isSA ? 'rgba(253,213,47,0.18)' : 'rgba(43,181,168,0.22)' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: '0.855rem', fontWeight: active ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Version footer */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.22)' }}>
          Pabett Beauty v2.0
        </Typography>
      </Box>
    </Box>
  );
}
