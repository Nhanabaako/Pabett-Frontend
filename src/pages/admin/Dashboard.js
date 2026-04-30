import React, { useEffect, useState } from 'react';
import {
  Grid, Box, CircularProgress, Stack, Typography, Avatar, Divider,
  Paper, Chip,
} from '@mui/material';
import InventoryIcon      from '@mui/icons-material/Inventory';
import CollectionsIcon    from '@mui/icons-material/Collections';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BookOnlineIcon     from '@mui/icons-material/BookOnline';
import SpaIcon            from '@mui/icons-material/Spa';
import StarIcon           from '@mui/icons-material/Star';
import GroupIcon          from '@mui/icons-material/Group';
import HelpIcon           from '@mui/icons-material/Help';
import EmojiEventsIcon    from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon         from '@mui/icons-material/Cancel';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001'
    : process.env.REACT_APP_API_URL || 'http://localhost:5001';

const authHeaders = () => {
  const token    = localStorage.getItem('token');
  const adminKey = localStorage.getItem('adminKey');
  return {
    'Content-Type': 'application/json',
    ...(token    && { Authorization: `Bearer ${token}` }),
    ...(adminKey && { 'x-admin-key': adminKey }),
  };
};

const BADGE_COLORS = {
  pending:       { bgcolor: '#FEF3C7', color: '#92400E' },
  confirmed:     { bgcolor: '#D1FAE5', color: '#065F46' },
  cancelled:     { bgcolor: '#FEE2E2', color: '#991B1B' },
  'in-studio':   { bgcolor: '#E0F2FE', color: '#0C4A6E' },
  'on-location': { bgcolor: '#FFF7ED', color: '#9A3412' },
};

function StatusChip({ status }) {
  const s = status || 'pending';
  return (
    <Chip
      label={s}
      size="small"
      sx={{
        ...(BADGE_COLORS[s] || { bgcolor: '#F1F5F9', color: '#64748B' }),
        fontWeight: 700,
        fontSize: '0.68rem',
        textTransform: 'capitalize',
        borderRadius: '999px',
        height: 22,
      }}
    />
  );
}

function TypeChip({ type }) {
  const isOnLocation = type === 'on-location';
  return (
    <Chip
      label={isOnLocation ? 'On-Location' : 'In-Studio'}
      size="small"
      sx={{
        ...(isOnLocation ? BADGE_COLORS['on-location'] : BADGE_COLORS['in-studio']),
        fontWeight: 700,
        fontSize: '0.68rem',
        borderRadius: '999px',
        height: 22,
      }}
    />
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <Paper
      sx={{
        background: '#fff',
        border: '1px solid #E2EBE9',
        borderRadius: '12px',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(30,45,79,0.08)' },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: color,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
        <Box sx={{
          width: 34, height: 34, borderRadius: '8px',
          bgcolor: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 18 } })}
        </Box>
        <Typography sx={{
          fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7E8AA8',
        }}>
          {label}
        </Typography>
      </Stack>
      <Typography sx={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '2.75rem', fontWeight: 600,
        color: '#1E2D4F', lineHeight: 1, mt: 1, mb: 0.5,
      }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: '0.8rem', color: '#7E8AA8', mt: 0.5 }}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

// ── Recent booking row ─────────────────────────────────────────────────────
function BookingRow({ b, isLast }) {
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        sx={{ px: 2.5, py: 1.75 }}
        spacing={1}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{
            width: 34, height: 34,
            bgcolor: '#E0F9F7', color: '#1F9A8E',
            fontWeight: 700, fontSize: '0.85rem',
          }}>
            {b.fullName?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E2D4F', lineHeight: 1.3 }}>
              {b.fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7E8AA8' }}>
              {b.service1}{b.service2 ? ` + ${b.service2}` : ''} · {b.date} at {b.time}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
          <TypeChip type={b.appointmentType} />
          <StatusChip status={b.status} />
        </Stack>
      </Stack>
      {!isLast && <Divider sx={{ borderColor: '#E2EBE9' }} />}
    </>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data,    setData]    = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = authHeaders();
    Promise.all([
      fetch(`${BASE_URL}/api/products`,    { headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/gallery`,     { headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/booking`,     { headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/services`,    { headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/testimonials`,{ headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/team`,        { headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/faqs`,        { headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/milestones`,  { headers }).then((r) => r.json()),
      fetch(`${BASE_URL}/api/availability`,{ headers }).then((r) => r.json()),
    ])
      .then(([products, gallery, bookingRes, services, testimonials, team, faqs, milestones, availability]) => {
        const bookings = bookingRes?.bookings || (Array.isArray(bookingRes) ? bookingRes : []);
        setData({
          products:     Array.isArray(products)     ? products     : [],
          gallery:      gallery?.images             || [],
          bookings,
          services:     Array.isArray(services)     ? services     : [],
          testimonials: Array.isArray(testimonials) ? testimonials : [],
          team:         Array.isArray(team)         ? team         : [],
          faqs:         Array.isArray(faqs)         ? faqs         : [],
          milestones:   Array.isArray(milestones)   ? milestones   : [],
          availability: Array.isArray(availability) ? availability : [],
        });
      })
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#2BB5A8' }} />
      </Box>
    );
  }

  const {
    products = [], gallery = [], bookings = [], services = [],
    testimonials = [], team = [], faqs = [], milestones = [], availability = [],
  } = data;

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings   = bookings.filter((b) => b.status === 'pending' || !b.status).length;
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
  const upcomingSlots     = availability.filter((s) => !s.closed).length;

  const STATS = [
    { icon: <BookOnlineIcon />,     label: 'Total Bookings',   value: bookings.length,     color: '#2196f3', sub: `${pendingBookings} pending` },
    { icon: <CheckCircleIcon />,    label: 'Confirmed',        value: confirmedBookings,   color: '#059669', sub: 'bookings confirmed' },
    { icon: <PendingActionsIcon />, label: 'Pending',          value: pendingBookings,     color: '#D97706', sub: 'awaiting confirmation' },
    { icon: <EventAvailableIcon />, label: 'Open Dates',       value: upcomingSlots,       color: '#2BB5A8', sub: 'available for booking' },
    { icon: <InventoryIcon />,      label: 'Products',         value: products.length,     color: '#9c27b0', sub: 'in catalogue' },
    { icon: <CollectionsIcon />,    label: 'Gallery Images',   value: gallery.length,      color: '#e91e63', sub: 'uploaded' },
    { icon: <SpaIcon />,            label: 'Services',         value: services.length,     color: '#0891b2', sub: 'active offerings' },
    { icon: <StarIcon />,           label: 'Testimonials',     value: testimonials.length, color: '#f59e0b', sub: 'client reviews' },
    { icon: <GroupIcon />,          label: 'Team Members',     value: team.length,         color: '#7c3aed', sub: 'active staff' },
    { icon: <HelpIcon />,           label: 'FAQs',             value: faqs.length,         color: '#0284c7', sub: 'published' },
    { icon: <EmojiEventsIcon />,    label: 'Milestones',       value: milestones.length,   color: '#d97706', sub: 'on About page' },
    { icon: <CancelIcon />,         label: 'Cancelled',        value: cancelledBookings,   color: '#C0392B', sub: 'bookings cancelled' },
  ];

  const recentBookings = [...bookings].slice(0, 6);

  return (
    <Box>
      {/* ── Page header ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#1E2D4F', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">Live overview of your beauty business</Typography>
        </Box>
      </Box>

      {/* ── Stat grid ── */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {STATS.map((s, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* ── Recent bookings ── */}
      {bookings.length > 0 && (
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.375rem', fontWeight: 500, color: '#1E2D4F' }}>
              Recent Bookings
            </Typography>
            <Chip
              label={`${bookings.length} total`}
              size="small"
              sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.68rem', borderRadius: '999px', height: 22 }}
            />
          </Stack>
          <Box sx={{ background: '#fff', border: '1px solid #E2EBE9', borderRadius: '10px', overflow: 'hidden' }}>
            {recentBookings.map((b, i) => (
              <BookingRow key={b._id || i} b={b} isLast={i === recentBookings.length - 1} />
            ))}
          </Box>
        </Box>
      )}

      {/* ── Empty state ── */}
      {bookings.length === 0 && (
        <Box sx={{ background: '#fff', border: '1px solid #E2EBE9', borderRadius: '10px', p: 6, textAlign: 'center' }}>
          <BookOnlineIcon sx={{ fontSize: 40, color: '#D6E5E2', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 600, color: '#7E8AA8' }}>No bookings yet</Typography>
          <Typography variant="caption" sx={{ color: '#7E8AA8' }}>
            Bookings will appear here once clients start reserving
          </Typography>
        </Box>
      )}
    </Box>
  );
}
