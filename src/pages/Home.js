import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Container, Grid, Card, CardMedia, CardContent,
  Typography, Button, Stack, Paper, TextField,
  FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Chip, Divider, InputAdornment,
  Stepper, Step, StepLabel, Alert,
} from '@mui/material';
import {
  Spa as SpaIcon,
  WhatsApp as WhatsAppIcon,
  EventAvailable as EventIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  StarRounded as StarIcon,
  ContentCut as ScissorsIcon,
  AutoAwesome as GlamourIcon,
  KeyboardArrowDown as ScrollDownIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import Testimonials from './Testimonials';

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────
const THEME = {
  primary:      '#00B6AD',
  secondary:    '#e8a598',
  darkText:     '#2C3E64',
  lightBg:      '#F7F9FB',
  gradient:     'linear-gradient(135deg, #00B6AD 0%, #007B76 100%)',
  gradientWarm: 'linear-gradient(135deg, #2C3E64 0%, #1a2a4a 100%)',
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const slides = [
  {
    image:    'images/caro-services/Caro1.jpg',
    badge:    '✨ Expert Styling',
    title:    'Elevate Your Look, Effortlessly',
    subtitle: 'Expert styling for natural radiance and glamour.',
    cta:      'Book Consultation',
  },
  {
    image:    'images/caro-services/Caro2.jpg',
    badge:    '💍 Bridal Specialist',
    title:    'Personalized Glamour for Every Event',
    subtitle: 'Bespoke makeup and hair services tailored to your occasion.',
    cta:      'Explore Services',
  },
  {
    image:    'images/caro-services/Caro4.jpg',
    badge:    '⭐ Luxury Experience',
    title:    'Luxury Beauty Experience',
    subtitle: 'Book your appointment for exceptional, professional care.',
    cta:      'Reserve Your Slot',
  },
  {
    image:    'images/Pabett oil Flier.png',
    badge:    '🌿 Signature Product',
    title:    'PABETT Hair Growth Oil',
    subtitle: 'Nourish. Strengthen. Grow. Shop our signature hair oil.',
    cta:      'Shop Now',
  },
];

const SERVICES_DATA = [
  {
    title:       'Bridal & Event Makeup',
    image:       'images/Caro-services/Makeup-services.jpg',
    description: 'Flawless, long-lasting looks for weddings, photoshoots and special occasions.',
    link:        '/services#makeup',
    icon:        <GlamourIcon />,
    badge:       'Most Popular',
    accent:      '#e8a598',
  },
  {
    title:       'Hair Styling & Treatments',
    image:       'images/Caro-services/Hair-styling.jpg',
    description: 'From elegant updos to deep conditioning — complete hair transformations.',
    link:        '/services#hair',
    icon:        <ScissorsIcon />,
    badge:       null,
    accent:      '#00B6AD',
  },
  {
    title:       'Wig Units & Customization',
    image:       'images/Caps/cap1.jpg',
    description: 'Custom unit construction, installation and precise styling for a natural look.',
    link:        '/services#wigs',
    icon:        <SpaIcon />,
    badge:       null,
    accent:      '#2C3E64',
  },
];

const BOOKING_SERVICES = [
  { value: 'event_makeup',  label: 'Event Makeup',     icon: <GlamourIcon  sx={{ fontSize: 18 }} /> },
  { value: 'bridal_makeup', label: 'Bridal Makeup',    icon: <StarIcon     sx={{ fontSize: 18 }} /> },
  { value: 'hairstyling',   label: 'Hair Styling',     icon: <ScissorsIcon sx={{ fontSize: 18 }} /> },
  { value: 'wig-units',     label: 'Wig Installation', icon: <SpaIcon      sx={{ fontSize: 18 }} /> },
  { value: 'consultation',  label: 'Consultation',     icon: <PersonIcon   sx={{ fontSize: 18 }} /> },
  { value: 'other',         label: 'Other',            icon: <EventIcon    sx={{ fontSize: 18 }} /> },
];

const FORM_STEPS = ['Your Details', 'Service & Schedule', 'Review & Send'];

const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '8+',   label: 'Years Experience' },
  { value: '99%',  label: 'Satisfaction Rate' },
  { value: '50+',  label: 'Services Offered' },
];

const WHY_CARD_ACCENTS = ['#00B6AD', '#e8a598', '#2C3E64', '#f59e0b'];

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
const Hero = () => (
  <>
    <style>{`
      .hero-swiper .swiper-button-next,
      .hero-swiper .swiper-button-prev {
        width: 44px; height: 44px;
        background: rgba(255,255,255,0.14);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.32);
        border-radius: 50%;
        color: #fff;
        transition: background 0.22s;
      }
      .hero-swiper .swiper-button-next:hover,
      .hero-swiper .swiper-button-prev:hover {
        background: rgba(255,255,255,0.26);
      }
      .hero-swiper .swiper-button-next::after,
      .hero-swiper .swiper-button-prev::after {
        font-size: 14px; font-weight: 800;
      }
      .hero-swiper .swiper-pagination-bullet {
        background: rgba(255,255,255,0.45); width: 8px; height: 8px;
        opacity: 1; transition: all 0.3s;
      }
      .hero-swiper .swiper-pagination-bullet-active {
        background: #fff; width: 26px; border-radius: 4px;
      }
    `}</style>

    <Box sx={{ height: { xs: '84vh', sm: '90vh', md: '96vh' }, width: '100%', overflow: 'hidden', position: 'relative' }}>
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        navigation loop
        pagination={{ clickable: true }}
        style={{ height: '100%', width: '100%' }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
              <Box
                component="img" src={s.image} alt={s.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
              />
              {/* Multi-layer overlay: subtle top vignette, heavy bottom */}
              <Box sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 28%, rgba(0,0,0,0.58) 66%, rgba(0,0,0,0.88) 100%)',
              }} />
              {/* Slide content */}
              <Box sx={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-end',
                pb: { xs: 12, md: 17 }, px: { xs: 3, md: 6 },
                textAlign: 'center',
              }}>
                <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
                  {/* Glass badge pill */}
                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center',
                    px: 2.5, py: 0.8, borderRadius: '999px', mb: 2.5,
                    background: 'rgba(255,255,255,0.13)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {s.badge}
                    </Typography>
                  </Box>

                  <Typography sx={{
                    color: '#fff', fontWeight: 800,
                    fontSize: { xs: '2.05rem', sm: '2.9rem', md: '4rem' },
                    lineHeight: 1.1, mb: 2,
                    textShadow: '0 3px 30px rgba(0,0,0,0.28)',
                    maxWidth: 840, mx: 'auto', letterSpacing: '-0.02em',
                  }}>
                    {s.title}
                  </Typography>

                  <Typography sx={{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: { xs: '1rem', md: '1.22rem' },
                    mb: 4.5, maxWidth: 580, mx: 'auto', lineHeight: 1.7,
                  }}>
                    {s.subtitle}
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                    <Button
                      href="#booking-form" variant="contained" size="large"
                      sx={{
                        bgcolor: THEME.primary, borderRadius: '999px',
                        px: { xs: 4.5, md: 6 }, py: 1.7, fontWeight: 700, fontSize: '1rem',
                        boxShadow: '0 8px 32px rgba(0,182,173,0.55)',
                        '&:hover': { bgcolor: '#009688', transform: 'translateY(-2px)', boxShadow: '0 14px 40px rgba(0,182,173,0.65)' },
                        transition: 'all 0.25s',
                      }}
                    >
                      {s.cta}
                    </Button>
                    <Button
                      href="https://wa.me/233571901526" target="_blank" rel="noopener noreferrer"
                      variant="outlined" size="large" startIcon={<WhatsAppIcon />}
                      sx={{
                        color: '#fff', borderColor: 'rgba(255,255,255,0.48)',
                        borderRadius: '999px', px: 4.5, py: 1.7, fontWeight: 600,
                        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                        background: 'rgba(255,255,255,0.09)',
                        '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.18)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      WhatsApp Us
                    </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Animated scroll indicator */}
      <Box sx={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'none' }}>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}>
          <ScrollDownIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 36 }} />
        </motion.div>
      </Box>
    </Box>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// STATS BANNER
// ─────────────────────────────────────────────────────────────────────────────
const StatsBanner = () => (
  <Box sx={{ background: THEME.gradient, py: { xs: 4.5, md: 5.5 } }}>
    <Container maxWidth="lg">
      <Grid container justifyContent="center">
        {STATS.map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Box sx={{
                textAlign: 'center', px: 2, py: 0.5,
                borderRight: { md: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none' },
              }}>
                <Typography sx={{
                  color: '#fff', fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.7rem' },
                  lineHeight: 1, letterSpacing: '-0.02em',
                }}>
                  {s.value}
                </Typography>
                <Typography sx={{
                  color: 'rgba(255,255,255,0.75)', mt: 0.5, fontWeight: 500,
                  fontSize: { xs: '0.75rem', md: '0.88rem' },
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {s.label}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CARD
// ─────────────────────────────────────────────────────────────────────────────
const ServiceCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12 }}
    style={{ width: '100%', height: '100%' }}
  >
    <Card sx={{
      borderRadius: 4, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      transition: 'transform 0.32s ease, box-shadow 0.32s ease',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 22px 52px rgba(0,0,0,0.13)' },
      height: '100%', display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {item.badge && (
        <Chip
          label={item.badge} size="small"
          sx={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            bgcolor: THEME.secondary, color: '#fff',
            fontWeight: 700, fontSize: '0.68rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        />
      )}

      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img" image={item.image} alt={item.title}
          sx={{
            width: '100%', height: 230, objectFit: 'cover', display: 'block',
            transition: 'transform 0.42s ease',
            '.MuiCard-root:hover &': { transform: 'scale(1.05)' },
          }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(44,62,100,0.48) 0%, transparent 52%)',
        }} />
      </Box>

      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1.2} alignItems="center" mb={1.5}>
          <Box sx={{
            bgcolor: `${item.accent}18`, p: 0.9, borderRadius: '50%',
            color: item.accent, display: 'flex',
          }}>
            {item.icon}
          </Box>
          <Typography variant="subtitle1" fontWeight={700} color={THEME.darkText}>
            {item.title}
          </Typography>
        </Stack>

        <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.65, mb: 2, flexGrow: 1 }}>
          {item.description}
        </Typography>

        <Button
          href={item.link} size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{ color: THEME.primary, fontWeight: 700, p: 0, alignSelf: 'flex-start', '&:hover': { bgcolor: 'transparent', opacity: 0.72 } }}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// WHY US
// ─────────────────────────────────────────────────────────────────────────────
const WhyUs = () => {
  const reasons = [
    { icon: '✨', title: 'Premium Products',  desc: 'Only top-grade, skin-safe products used on every client.' },
    { icon: '🎓', title: 'Expert Team',       desc: 'Certified stylists with years of hands-on experience.' },
    { icon: '💖', title: 'Personalized Care', desc: 'Every look is tailored to your unique features and style.' },
    { icon: '📅', title: 'Easy Booking',      desc: 'Simple online booking with 24-hour confirmation.' },
  ];
  return (
    <Box sx={{ py: { xs: 7, md: 11 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Chip label="WHY CHOOSE US" sx={{ bgcolor: `${THEME.primary}15`, color: THEME.primary, fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h4" fontWeight={800} color={THEME.darkText}>The Pabett Difference</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 520, mx: 'auto' }}>
            We don't just do beauty — we create experiences that leave you glowing inside and out.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {reasons.map((r, i) => (
            <Grid item xs={12} sm={6} md={3} key={i} display="flex">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ width: '100%', display: 'flex' }}
              >
                <Paper sx={{
                  width: '100%', p: 3.5, borderRadius: 4,
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  border: '1px solid #edf2f7',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  '&:hover': { boxShadow: `0 10px 36px ${WHY_CARD_ACCENTS[i]}28`, transform: 'translateY(-5px)' },
                  '&::before': {
                    content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                    height: '4px', background: WHY_CARD_ACCENTS[i], borderRadius: '4px 4px 0 0',
                  },
                }}>
                  <Box sx={{
                    width: 58, height: 58, borderRadius: '50%', mb: 2, mt: 0.5,
                    bgcolor: `${WHY_CARD_ACCENTS[i]}14`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.7rem',
                  }}>
                    {r.icon}
                  </Box>
                  <Typography fontWeight={700} color={THEME.darkText} gutterBottom>{r.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{r.desc}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING FORM
// ─────────────────────────────────────────────────────────────────────────────
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover fieldset': { borderColor: THEME.primary },
    '&.Mui-focused fieldset': { borderColor: THEME.primary, borderWidth: '2px' },
  },
  '& label.Mui-focused': { color: THEME.primary },
};

const BookingForm = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    service1: '', service2: '',
    appointmentType: '', locationDetail: '',
    date: '', time: '', occasion: '', notes: '',
  });
  const [loading,      setLoading]      = useState(false);
  const [availability, setAvailability] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : (process.env.REACT_APP_API_URL || '');
    fetch(`${BASE}/api/availability`)
      .then((r) => r.json())
      .then((data) => setAvailability(Array.isArray(data) ? data : []))
      .catch(() => setAvailability([]))
      .finally(() => setLoadingSlots(false));
  }, []);

  const selectedSlot   = availability.find((s) => s.date === form.date);
  const isClosedDate   = selectedSlot?.closed === true;
  const adminTimes     = selectedSlot?.times || [];
  const bookedTimes    = selectedSlot?.booked || [];
  const availableTimes = adminTimes.filter((t) => !bookedTimes.includes(t));
  const allTimesTaken  = adminTimes.length > 0 && availableTimes.length === 0 && !isClosedDate;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 15) : value }));
  };

  const phoneValid   = useMemo(() => form.phone.length >= 10, [form.phone]);
  const availableSec = useMemo(() => BOOKING_SERVICES.filter((s) => s.value !== form.service1), [form.service1]);

  const step0Valid = form.fullName.trim() && form.email.trim() && phoneValid;
  const step1Valid =
    form.service1 && form.appointmentType && form.date && form.time &&
    !isClosedDate && !allTimesTaken &&
    (form.appointmentType !== 'on-location' || form.locationDetail.trim());

  const nextStep = () => {
    if (step === 0 && !step0Valid) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill name, email and a valid phone.', confirmButtonColor: THEME.primary });
      return;
    }
    if (step === 1 && !step1Valid) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please complete all required fields.', confirmButtonColor: THEME.primary });
      return;
    }
    setStep((s) => s + 1);
  };

  const serviceLabel = (val) => BOOKING_SERVICES.find((s) => s.value === val)?.label || val;

  const submit = useCallback(async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5001/api/booking'
        : `${process.env.REACT_APP_API_URL || ''}/api/booking`;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.text()) || 'Server error');
      const json = await res.json();
      Swal.fire({
        icon: 'success', title: '🎉 Booking Sent!',
        text: json.message || "We'll contact you within 24 hours to confirm.",
        confirmButtonColor: THEME.primary, confirmButtonText: 'Wonderful, thanks!',
      });
      setForm({ fullName: '', email: '', phone: '', service1: '', service2: '', appointmentType: '', locationDetail: '', date: '', time: '', occasion: '', notes: '' });
      setStep(0);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Booking Failed', text: err.message || 'Please try again or reach us on WhatsApp.', confirmButtonColor: THEME.primary });
    } finally {
      setLoading(false);
    }
  }, [form]);

  const slide = { enter: { opacity: 0, x: 28 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -28 } };

  return (
    <Box
      id="booking-form"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(158deg, #f0fdfc 0%, #e6f6f5 40%, #eef2ff 100%)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <Box sx={{ position: 'absolute', top: -110, right: -110, width: 420, height: 420, borderRadius: '50%', background: `${THEME.primary}0d`, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -90, left: -90, width: 320, height: 320, borderRadius: '50%', background: `${THEME.darkText}07`, pointerEvents: 'none' }} />

      <Container maxWidth="md">
        {/* Heading */}
        <Box textAlign="center" mb={4}>
          <Chip label="BOOK AN APPOINTMENT" sx={{ bgcolor: `${THEME.primary}18`, color: THEME.primary, fontWeight: 700, mb: 2, letterSpacing: 1 }} />
          <Typography variant="h3" fontWeight={800} color={THEME.darkText} sx={{ fontSize: { xs: '1.85rem', md: '2.6rem' }, letterSpacing: '-0.01em' }}>
            Request Your Appointment
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 510, mx: 'auto', fontSize: '1.02rem', lineHeight: 1.65 }}>
            Fill in the form and we'll confirm your booking within 24 hours.
          </Typography>
        </Box>

        {/* Perks strip — replaces the old side panel */}
        <Stack direction="row" flexWrap="wrap" justifyContent="center" sx={{ mb: 5, gap: '10px' }}>
          {[
            { icon: '⚡', text: '24-hr confirmation' },
            { icon: '💬', text: 'WhatsApp support' },
            { icon: '📍', text: 'In-studio or at-home' },
            { icon: '✅', text: 'Free consultation' },
            { icon: '🌟', text: '500+ happy clients' },
          ].map((item, i) => (
            <Box key={i} sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.8,
              px: 2.2, py: 1, borderRadius: '999px', whiteSpace: 'nowrap',
              bgcolor: '#fff', border: '1px solid rgba(0,182,173,0.22)',
              boxShadow: '0 2px 12px rgba(0,182,173,0.09)',
              fontSize: '0.82rem', fontWeight: 600, color: THEME.darkText,
            }}>
              <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</Box>
              {item.text}
            </Box>
          ))}
        </Stack>

        {/* Form card */}
        <Paper elevation={0} sx={{
          borderRadius: 5, overflow: 'hidden',
          boxShadow: '0 20px 70px rgba(0,0,0,0.09)',
          border: '1px solid rgba(0,182,173,0.13)',
        }}>
          {/* Gradient stepper header */}
          <Box sx={{ background: THEME.gradient, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3.5 } }}>
            <Stepper activeStep={step} alternativeLabel>
              {FORM_STEPS.map((label, i) => (
                <Step key={label}>
                  <StepLabel sx={{
                    '& .MuiStepLabel-label': {
                      color: i <= step ? '#fff' : 'rgba(255,255,255,0.42)',
                      fontWeight: i === step ? 700 : 400,
                      fontSize: { xs: '0.72rem', md: '0.85rem' },
                    },
                    '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.28)' },
                    '& .MuiStepIcon-root.Mui-active':    { color: '#fff' },
                    '& .MuiStepIcon-root.Mui-completed': { color: 'rgba(255,255,255,0.68)' },
                    '& .MuiStepIcon-text': { fill: THEME.darkText },
                  }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Form body */}
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, bgcolor: '#fff' }}>
            <AnimatePresence mode="wait">

              {/* ── Step 0: Personal Details ── */}
              {step === 0 && (
                <motion.div key="s0" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26 }}>
                  <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ fontSize: '1.25rem' }}>👤</Box> Your Details
                  </Typography>
                  <Grid container spacing={2.5}>
                    {/* Full name — own row */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Full Name *" name="fullName"
                        value={form.fullName} onChange={handleChange}
                        placeholder="e.g., Abena Mensah" sx={inputSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: THEME.primary, fontSize: 20 }} /></InputAdornment> }}
                      />
                    </Grid>
                    {/* Email + Phone side by side */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Email Address *" name="email" type="email"
                        value={form.email} onChange={handleChange}
                        placeholder="you@example.com" sx={inputSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: THEME.primary, fontSize: 20 }} /></InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Phone Number *" name="phone"
                        value={form.phone} onChange={handleChange}
                        placeholder="e.g., 0241234567"
                        error={form.phone !== '' && !phoneValid}
                        helperText={form.phone !== '' && !phoneValid ? 'Minimum 10 digits' : ''}
                        sx={inputSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: THEME.primary, fontSize: 20 }} /></InputAdornment> }}
                      />
                    </Grid>
                  </Grid>
                </motion.div>
              )}

              {/* ── Step 1: Service & Schedule ── */}
              {step === 1 && (
                <motion.div key="s1" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26 }}>
                  <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ fontSize: '1.25rem' }}>💅</Box> Service & Schedule
                  </Typography>
                  <Grid container spacing={2.5}>

                    {/* Primary service + Add-on side by side */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required sx={inputSx}>
                        <InputLabel>Primary Service *</InputLabel>
                        <Select name="service1" value={form.service1} label="Primary Service *" onChange={handleChange}>
                          <MenuItem value="">Select a service</MenuItem>
                          {BOOKING_SERVICES.map((s) => (
                            <MenuItem key={s.value} value={s.value}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ color: THEME.primary }}>{s.icon}</Box>
                                <span>{s.label}</span>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={!form.service1} sx={inputSx}>
                        <InputLabel>Add-on Service (optional)</InputLabel>
                        <Select name="service2" value={form.service2} label="Add-on Service (optional)" onChange={handleChange}>
                          <MenuItem value="">None</MenuItem>
                          {availableSec.map((s) => (
                            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Date — full width with integrated label */}
                    <Grid item xs={12}>
                      {loadingSlots ? (
                        <CircularProgress size={22} sx={{ color: THEME.primary }} />
                      ) : (
                        <>
                          <TextField
                            fullWidth label="Preferred Date *" name="date" type="date"
                            value={form.date}
                            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value, time: '' }))}
                            inputProps={{ min: today }}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon sx={{ color: THEME.primary, fontSize: 20 }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                          {form.date && isClosedDate && (
                            <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }}>
                              This date is not available. Please choose another.
                            </Alert>
                          )}
                          {form.date && allTimesTaken && (
                            <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
                              All slots are fully booked. Please choose another date.
                            </Alert>
                          )}
                        </>
                      )}
                    </Grid>

                    {/* Time — full width; chips or text input */}
                    <Grid item xs={12}>
                      {!form.date || isClosedDate ? (
                        <TextField
                          fullWidth label="Preferred Time *" name="time"
                          value="" disabled sx={inputSx}
                          placeholder={!form.date ? 'Choose a date first' : 'Date is closed — pick another'}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <TimeIcon sx={{ color: '#bbb', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : adminTimes.length > 0 ? (
                        /* Admin has set specific time slots — show as chips */
                        <Box sx={{
                          border: '1px solid #e0e0e0', borderRadius: '12px',
                          p: 2, bgcolor: '#fafafa',
                        }}>
                          <Typography variant="caption" sx={{
                            fontWeight: 700, color: '#7E8AA8',
                            display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5,
                            textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem',
                          }}>
                            <TimeIcon sx={{ fontSize: 13, color: THEME.primary }} /> Select a time slot *
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {adminTimes.map((t) => {
                              const isBooked   = bookedTimes.includes(t);
                              const isSelected = form.time === t;
                              return (
                                <Box
                                  key={t}
                                  onClick={() => !isBooked && setForm((p) => ({ ...p, time: t }))}
                                  sx={{
                                    px: 2.2, py: 0.85, borderRadius: '10px',
                                    cursor: isBooked ? 'not-allowed' : 'pointer',
                                    border: `2px solid ${isSelected ? THEME.primary : isBooked ? '#fecaca' : '#e0e0e0'}`,
                                    bgcolor: isSelected ? THEME.primary : isBooked ? '#fff5f5' : '#fff',
                                    color: isSelected ? '#fff' : isBooked ? '#c0392b' : THEME.darkText,
                                    opacity: isBooked ? 0.7 : 1,
                                    fontSize: '0.82rem', fontWeight: 600,
                                    transition: 'all 0.18s',
                                    userSelect: 'none',
                                    '&:hover': !isBooked ? { borderColor: THEME.primary, bgcolor: `${THEME.primary}12` } : {},
                                  }}
                                >
                                  {t}
                                  {isBooked && (
                                    <Box component="span" sx={{ fontSize: '0.6rem', display: 'block', color: 'inherit', mt: 0.2 }}>Booked</Box>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      ) : (
                        /* No admin slots — free time picker */
                        <TextField
                          fullWidth label="Preferred Time *" name="time" type="time"
                          value={form.time} onChange={handleChange}
                          InputLabelProps={{ shrink: true }} sx={inputSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <TimeIcon sx={{ color: THEME.primary, fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Grid>

                    {/* Appointment type + Location side by side when on-location */}
                    <Grid item xs={12} sm={form.appointmentType === 'on-location' ? 6 : 12}>
                      <FormControl fullWidth required sx={inputSx}>
                        <InputLabel>Appointment Type *</InputLabel>
                        <Select name="appointmentType" value={form.appointmentType} label="Appointment Type *" onChange={handleChange}>
                          <MenuItem value="">Select type</MenuItem>
                          <MenuItem value="in-studio">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <SpaIcon sx={{ color: THEME.primary, fontSize: 18 }} />
                              <span>In-Studio — Visit our salon</span>
                            </Stack>
                          </MenuItem>
                          <MenuItem value="on-location">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <LocationIcon sx={{ color: '#ff9800', fontSize: 18 }} />
                              <span>On-Location — We come to you</span>
                            </Stack>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {form.appointmentType === 'on-location' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth label="Service Address *" name="locationDetail"
                          value={form.locationDetail} onChange={handleChange}
                          placeholder="Full address of venue or home" sx={inputSx}
                          InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ color: '#ff9800', fontSize: 20 }} /></InputAdornment> }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </motion.div>
              )}

              {/* ── Step 2: Review & Confirm ── */}
              {step === 2 && (
                <motion.div key="s2" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26 }}>
                  <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ fontSize: '1.25rem' }}>📋</Box> Review & Confirm
                  </Typography>

                  {/* Summary card */}
                  <Paper variant="outlined" sx={{
                    p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3,
                    bgcolor: `${THEME.primary}06`, borderColor: `${THEME.primary}22`,
                  }}>
                    <Typography variant="subtitle2" fontWeight={700} color={THEME.primary} mb={2}>
                      Booking Summary
                    </Typography>
                    <Grid container spacing={1.5}>
                      {[
                        { label: 'Name',    value: form.fullName },
                        { label: 'Email',   value: form.email },
                        { label: 'Phone',   value: form.phone },
                        { label: 'Service', value: serviceLabel(form.service1) },
                        form.service2 && { label: 'Add-on',  value: serviceLabel(form.service2) },
                        { label: 'Date',    value: form.date },
                        { label: 'Time',    value: form.time },
                        { label: 'Type',    value: form.appointmentType === 'on-location' ? 'On-Location' : 'In-Studio' },
                        form.locationDetail && { label: 'Address', value: form.locationDetail },
                      ].filter(Boolean).map((row) => (
                        <Grid item xs={12} sm={6} key={row.label}>
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 64, fontWeight: 500, pt: 0.1 }}>
                              {row.label}:
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color={THEME.darkText}>
                              {row.value}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>

                  <Divider sx={{ mb: 3 }} />

                  {/* Occasion + Notes each full width */}
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Occasion (optional)" name="occasion"
                        value={form.occasion} onChange={handleChange}
                        placeholder="e.g., Wedding, Birthday, Graduation" sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Notes / Special Requests (optional)" name="notes"
                        value={form.notes} onChange={handleChange}
                        multiline rows={4}
                        placeholder="Any specific requests, allergies, or things we should know…"
                        sx={inputSx}
                      />
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', justifyContent: step === 0 ? 'flex-end' : 'space-between', mt: 5, gap: 2, flexWrap: 'wrap' }}>
              {step > 0 && (
                <Button
                  variant="outlined" startIcon={<ArrowBackIcon />}
                  onClick={() => setStep((s) => s - 1)}
                  sx={{ borderRadius: '999px', px: { xs: 3, md: 4 }, borderColor: THEME.primary, color: THEME.primary, '&:hover': { bgcolor: `${THEME.primary}10` } }}
                >
                  Back
                </Button>
              )}
              {step < 2 ? (
                <Button
                  variant="contained" endIcon={<ArrowForwardIcon />} onClick={nextStep}
                  sx={{
                    borderRadius: '999px', px: { xs: 4, md: 5.5 }, py: 1.45,
                    background: THEME.gradient, fontWeight: 700,
                    boxShadow: '0 4px 22px rgba(0,182,173,0.38)',
                    '&:hover': { opacity: 0.9, transform: 'translateY(-1px)' },
                    transition: 'all 0.2s',
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained" endIcon={loading ? null : <CheckCircleIcon />}
                  onClick={submit} disabled={loading}
                  sx={{
                    borderRadius: '999px', px: { xs: 4, md: 5.5 }, py: 1.5,
                    background: THEME.gradient, fontWeight: 700, fontSize: '1rem',
                    boxShadow: '0 4px 22px rgba(0,182,173,0.38)',
                    '&:hover': { opacity: 0.9, transform: 'translateY(-1px)' },
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} sx={{ color: '#fff' }} />
                      <span>Sending…</span>
                    </Stack>
                  ) : 'Submit Booking Request'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Box sx={{ bgcolor: THEME.lightBg }}>
      <Hero />
      <StatsBanner />

      {/* Services */}
      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="WHAT WE OFFER" sx={{ bgcolor: `${THEME.primary}15`, color: THEME.primary, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={800} color={THEME.darkText}>Our Signature Services</Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 500, mx: 'auto' }}>
              We specialize in enhancing your natural beauty for every moment that matters.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {SERVICES_DATA.map((s, i) => (
              <Grid key={i} item xs={12} sm={6} md={4} display="flex">
                <ServiceCard item={s} index={i} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <WhyUs />

      {/* Testimonials */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: THEME.lightBg }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={2}>
            <Chip label="CLIENT LOVE" sx={{ bgcolor: `${THEME.primary}15`, color: THEME.primary, fontWeight: 700, mb: 1.5 }} />
          </Box>
          <Testimonials />
        </Container>
      </Box>

      <BookingForm />
    </Box>
  );
}
