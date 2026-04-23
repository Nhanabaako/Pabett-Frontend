import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Container, Grid, Card, CardMedia, CardContent,
  Typography, Button, Stack, Paper, TextField,
  FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Chip, Divider, InputAdornment,
  Stepper, Step, StepLabel,
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
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
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
// THEME & CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const THEME = {
  primary:   '#00B6AD',
  secondary: '#e8a598',
  darkText:  '#2C3E64',
  lightBg:   '#F7F9FB',
  gradient:  'linear-gradient(135deg, #00B6AD 0%, #007B76 100%)',
  gradientWarm: 'linear-gradient(135deg, #2C3E64 0%, #1a2a4a 100%)',
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const slides = [
  {
    image: 'images/caro-services/Caro1.jpg',
    label: 'Bridal & Makeup',
    title: 'Elevate Your Look, Effortlessly',
    subtitle: 'Expert styling for natural radiance and glamour.',
    cta: 'Book Consultation',
  },
  {
    image: 'images/caro-services/Caro2.jpg',
    label: 'Hair Styling',
    title: 'Personalized Glamour for Every Event',
    subtitle: 'Bespoke makeup and hair services tailored to your occasion.',
    cta: 'Explore Services',
  },
  {
    image: 'images/caro-services/Caro4.jpg',
    label: 'Wig Units',
    title: 'Luxury Beauty Experience',
    subtitle: 'Book your appointment for exceptional, professional care.',
    cta: 'Reserve Your Slot',
  },
  {
    image: 'images/Pabett oil Flier.png',
    label: 'Hair Growth Oil',
    title: 'PABETT Hair Growth Oil',
    subtitle: 'Nourish. Strengthen. Grow. Shop our signature hair oil.',
    cta: 'Shop Now',
  },
];

const SERVICES_DATA = [
  {
    title: 'Bridal & Event Makeup',
    image: 'images/Caro-services/Makeup-services.jpg',
    description: 'Flawless, long-lasting looks for weddings, photoshoots and special occasions.',
    link: '/services#makeup',
    icon: <GlamourIcon />,
    badge: 'Most Popular',
  },
  {
    title: 'Hair Styling & Treatments',
    image: 'images/Caro-services/Hair-styling.jpg',
    description: 'From elegant updos to deep conditioning — complete hair transformations.',
    link: '/services#hair',
    icon: <ScissorsIcon />,
    badge: null,
  },
  {
    title: 'Wig Units & Customization',
    image: 'images/Caps/cap8.jpg',
    description: 'Custom unit construction, installation and precise styling for a natural look.',
    link: '/services#wigs',
    icon: <SpaIcon />,
    badge: null,
  },
];

const BOOKING_SERVICES = [
  { value: 'event_makeup',   label: 'Event Makeup',           icon: <GlamourIcon sx={{ fontSize: 18 }} /> },
  { value: 'bridal_makeup',  label: 'Bridal Makeup',          icon: <StarIcon    sx={{ fontSize: 18 }} /> },
  { value: 'hairstyling',    label: 'Hair Styling',           icon: <ScissorsIcon sx={{ fontSize: 18 }} /> },
  { value: 'wig-units',      label: 'Wig Installation',       icon: <SpaIcon     sx={{ fontSize: 18 }} /> },
  { value: 'consultation',   label: 'Consultation',           icon: <PersonIcon  sx={{ fontSize: 18 }} /> },
  { value: 'other',          label: 'Other',                  icon: <EventIcon   sx={{ fontSize: 18 }} /> },
];

const FORM_STEPS = ['Your Details', 'Service & Time', 'Review & Send'];

const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '8+',   label: 'Years Experience' },
  { value: '99%',  label: 'Satisfaction Rate' },
  { value: '50+',  label: 'Services Offered' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Full-viewport hero carousel */
const Hero = () => (
  <Box sx={{ height: { xs: '72vh', sm: '80vh', md: '94vh' }, width: '100%', overflow: 'hidden', position: 'relative' }}>
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      effect="fade"
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      navigation
      loop
      pagination={{ clickable: true }}
      style={{ height: '100%', width: '100%' }}
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i}>
          <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <Box
              component="img"
              src={s.image}
              alt={s.title}
              sx={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 20%',
                display: 'block',
              }}
            />
            {/* Layered gradient overlay */}
            <Box
              sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.72) 100%)',
              }}
            />
            {/* Content */}
            <Box
              sx={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-end',
                pb: { xs: 7, md: 14 }, px: { xs: 3, md: 6 },
                textAlign: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label={s.label}
                  size="small"
                  sx={{
                    mb: 2, bgcolor: THEME.primary, color: '#fff',
                    fontWeight: 700, letterSpacing: 1, fontSize: '0.72rem',
                  }}
                />
                <Typography
                  sx={{
                    color: '#fff', fontWeight: 800,
                    fontSize: { xs: '1.8rem', sm: '2.6rem', md: '3.6rem' },
                    lineHeight: 1.15, mb: 1.5,
                    textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                    maxWidth: 800, mx: 'auto',
                  }}
                >
                  {s.title}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: { xs: '0.98rem', md: '1.2rem' },
                    mb: 3.5, maxWidth: 560, mx: 'auto',
                  }}
                >
                  {s.subtitle}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                  <Button
                    href="#booking-form"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: THEME.primary, borderRadius: '999px',
                      px: { xs: 4, md: 5 }, py: 1.5, fontWeight: 700,
                      fontSize: '1rem', boxShadow: '0 6px 24px rgba(0,182,173,0.45)',
                      '&:hover': { bgcolor: '#009688', transform: 'translateY(-2px)' },
                      transition: 'all 0.25s',
                    }}
                  >
                    {s.cta}
                  </Button>
                  <Button
                    href="https://wa.me/233571901526"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="large"
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      color: '#fff', borderColor: 'rgba(255,255,255,0.65)',
                      borderRadius: '999px', px: 4, py: 1.5, fontWeight: 600,
                      backdropFilter: 'blur(4px)',
                      '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
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

    {/* Scroll cue */}
    <Box
      sx={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)', zIndex: 10,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      >
        <Box
          sx={{
            width: 28, height: 44, border: '2px solid rgba(255,255,255,0.55)',
            borderRadius: '999px', display: 'flex', justifyContent: 'center', pt: 1,
          }}
        >
          <Box sx={{ width: 4, height: 8, bgcolor: '#fff', borderRadius: '999px' }} />
        </Box>
      </motion.div>
    </Box>
  </Box>
);

/** Stats banner */
const StatsBanner = () => (
  <Box sx={{ background: THEME.gradient, py: { xs: 4, md: 5 } }}>
    <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center">
        {STATS.map((s, i) => (
          <Grid item xs={6} md={3} key={i} sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Typography
                sx={{
                  color: '#fff', fontWeight: 800,
                  fontSize: { xs: '1.8rem', md: '2.4rem' },
                  lineHeight: 1,
                }}
              >
                {s.value}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: { xs: '0.8rem', md: '0.95rem' },
                  mt: 0.5, fontWeight: 500,
                }}
              >
                {s.label}
              </Typography>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

/** Service card */
const ServiceCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12 }}
  >
    <Card
      sx={{
        borderRadius: 4, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 16px 40px rgba(0,0,0,0.14)' },
        height: '100%', display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}
    >
      {item.badge && (
        <Chip
          label={item.badge}
          size="small"
          sx={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            bgcolor: THEME.secondary, color: '#fff',
            fontWeight: 700, fontSize: '0.7rem',
          }}
        />
      )}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={item.image}
          alt={item.title}
          sx={{
            height: { xs: 200, md: 230 }, objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.06)' },
          }}
        />
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(44,62,100,0.55) 0%, transparent 60%)',
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <Box
            sx={{
              bgcolor: `${THEME.primary}15`, p: 0.8, borderRadius: '50%',
              color: THEME.primary, display: 'flex',
            }}
          >
            {item.icon}
          </Box>
          <Typography variant="h6" fontWeight={700} color={THEME.darkText}>
            {item.title}
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.7, mb: 2 }}>
          {item.description}
        </Typography>
        <Button
          href={item.link}
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{ color: THEME.primary, fontWeight: 700, p: 0, '&:hover': { bgcolor: 'transparent', opacity: 0.75 } }}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

/** Why Choose Us strip */
const WhyUs = () => {
  const reasons = [
    { icon: '✨', title: 'Premium Products', desc: 'Only top-grade, skin-safe products used on every client.' },
    { icon: '🎓', title: 'Expert Team',      desc: 'Certified stylists with years of hands-on experience.' },
    { icon: '💖', title: 'Personalized Care', desc: 'Every look is tailored to your unique features and style.' },
    { icon: '📅', title: 'Easy Booking',      desc: 'Simple online booking with 24-hour confirmation.' },
  ];
  return (
    <Box sx={{ py: { xs: 7, md: 11 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Chip label="WHY CHOOSE US" sx={{ bgcolor: `${THEME.primary}15`, color: THEME.primary, fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h4" fontWeight={800} color={THEME.darkText}>
            The Pabett Difference
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 520, mx: 'auto' }}>
            We don't just do beauty — we create experiences that leave you glowing inside and out.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {reasons.map((r, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3.5, borderRadius: 4, textAlign: 'center', height: '100%',
                    border: '1px solid #edf2f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(0,182,173,0.12)', transform: 'translateY(-4px)' },
                  }}
                >
                  <Box sx={{ fontSize: '2.2rem', mb: 1.5 }}>{r.icon}</Box>
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
// BOOKING FORM — 3-step, full-width, richly styled
// ─────────────────────────────────────────────────────────────────────────────
const BookingForm = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    service1: '', service2: '',
    appointmentType: '', locationDetail: '',
    date: '', time: '', occasion: '', notes: '',
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 15) : value,
    }));
  };

  const phoneValid   = useMemo(() => form.phone.length >= 10, [form.phone]);
  const availableSec = useMemo(
    () => BOOKING_SERVICES.filter((s) => s.value !== form.service1),
    [form.service1],
  );

  const step0Valid = form.fullName.trim() && form.email.trim() && phoneValid;
  const step1Valid =
    form.service1 && form.appointmentType && form.date && form.time &&
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
        ? 'http://localhost:5000/api/booking'
        : `${process.env.REACT_APP_API_URL}/api/booking`;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.text()) || 'Server error');
      const json = await res.json();
      Swal.fire({
        icon: 'success',
        title: '🎉 Booking Sent!',
        text: json.message || "'We'll contact you within 24 hours to confirm.",
        confirmButtonColor: THEME.primary,
        confirmButtonText: 'Wonderful, thanks!',
      });
      setForm({ fullName: '', email: '', phone: '', service1: '', service2: '', appointmentType: '', locationDetail: '', date: '', time: '', occasion: '', notes: '' });
      setStep(0);
    } catch (err) {
      Swal.fire({
        icon: 'error', title: 'Booking Failed',
        text: err.message || 'Please try again or reach us on WhatsApp.',
        confirmButtonColor: THEME.primary,
      });
    } finally {
      setLoading(false);
    }
  }, [form]);

  const slideVariants = {
    enter:  { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: -40 },
  };

  return (
    <Box
      id="booking-form"
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(170deg, ${THEME.lightBg} 0%, #e8f6f5 100%)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: -80, right: -80,
        width: 340, height: 340, borderRadius: '50%',
        background: `${THEME.primary}12`, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -60, left: -60,
        width: 260, height: 260, borderRadius: '50%',
        background: `${THEME.darkText}08`, pointerEvents: 'none',
      }} />

      <Container maxWidth="lg">
        {/* Section heading */}
        <Box textAlign="center" mb={6}>
          <Chip
            label="BOOK AN APPOINTMENT"
            sx={{ bgcolor: `${THEME.primary}18`, color: THEME.primary, fontWeight: 700, mb: 2, letterSpacing: 1 }}
          />
          <Typography variant="h3" fontWeight={800} color={THEME.darkText} sx={{ fontSize: { xs: '1.9rem', md: '2.7rem' } }}>
            Request Your Appointment
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 560, mx: 'auto', fontSize: '1.05rem' }}>
            Fill in the form below and we'll reach out within 24 hours to confirm your booking.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 0, md: 4 }} alignItems="flex-start">
          {/* ── Left info panel (desktop only) ── */}
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                background: THEME.gradient,
                borderRadius: 4, p: 4, color: '#fff',
                position: 'sticky', top: 100,
                boxShadow: '0 12px 40px rgba(0,182,173,0.25)',
              }}
            >
              <Typography variant="h5" fontWeight={800} mb={1}>Why Book With Us?</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 3, lineHeight: 1.7 }}>
                Experience beauty services tailored to you, delivered by certified professionals.
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.25)', mb: 3 }} />
              {[
                { icon: '⚡', text: '24-hr confirmation' },
                { icon: '💬', text: 'WhatsApp support' },
                { icon: '📍', text: 'In-studio or mobile' },
                { icon: '✅', text: 'Free consultation' },
                { icon: '🌟', text: '500+ happy clients' },
              ].map((item, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="center" mb={1.8}>
                  <Box sx={{ fontSize: '1.2rem' }}>{item.icon}</Box>
                  <Typography variant="body2" sx={{ opacity: 0.92, fontWeight: 500 }}>{item.text}</Typography>
                </Stack>
              ))}
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.25)', my: 3 }} />
              <Button
                href="https://wa.me/233571901526"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon />}
                fullWidth
                variant="outlined"
                sx={{
                  color: '#fff', borderColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '999px', fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                }}
              >
                Chat on WhatsApp
              </Button>
            </Box>
          </Grid>

          {/* ── Right: form card ── */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4, overflow: 'hidden',
                boxShadow: '0 8px 48px rgba(0,0,0,0.10)',
                border: '1px solid rgba(0,182,173,0.1)',
              }}
            >
              {/* Stepper header */}
              <Box
                sx={{
                  background: THEME.gradient,
                  px: { xs: 2, md: 5 }, py: { xs: 2.5, md: 3.5 },
                }}
              >
                <Stepper activeStep={step} alternativeLabel>
                  {FORM_STEPS.map((label, i) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          '& .MuiStepLabel-label': {
                            color: i <= step ? '#fff' : 'rgba(255,255,255,0.5)',
                            fontWeight: i === step ? 700 : 400,
                            fontSize: { xs: '0.72rem', md: '0.85rem' },
                          },
                          '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.35)' },
                          '& .MuiStepIcon-root.Mui-active':    { color: '#fff' },
                          '& .MuiStepIcon-root.Mui-completed': { color: 'rgba(255,255,255,0.75)' },
                          '& .MuiStepIcon-text': { fill: THEME.darkText },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Form body */}
              <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <AnimatePresence mode="wait">
                  {/* ── Step 0: Personal Info ── */}
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      variants={slideVariants}
                      initial="enter" animate="center" exit="exit"
                      transition={{ duration: 0.32 }}
                    >
                      <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3}>
                        👤 Your Personal Details
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth label="Full Name *" name="fullName"
                            value={form.fullName} onChange={handleChange}
                            placeholder="e.g., Abena Mensah"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon sx={{ color: THEME.primary }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="Email Address *" name="email"
                            type="email" value={form.email} onChange={handleChange}
                            placeholder="you@example.com"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: THEME.primary }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="Phone Number *" name="phone"
                            value={form.phone} onChange={handleChange}
                            placeholder="e.g., 0241234567"
                            error={form.phone !== '' && !phoneValid}
                            helperText={form.phone !== '' && !phoneValid ? 'Minimum 10 digits required' : ''}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon sx={{ color: THEME.primary }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </motion.div>
                  )}

                  {/* ── Step 1: Service & Schedule ── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={slideVariants}
                      initial="enter" animate="center" exit="exit"
                      transition={{ duration: 0.32 }}
                    >
                      <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3}>
                        💅 Service & Schedule
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required>
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
                          <FormControl fullWidth disabled={!form.service1}>
                            <InputLabel>Additional Service (optional)</InputLabel>
                            <Select name="service2" value={form.service2} label="Additional Service (optional)" onChange={handleChange}>
                              <MenuItem value="">None</MenuItem>
                              {availableSec.map((s) => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="Preferred Date *" name="date" type="date"
                            value={form.date} onChange={handleChange}
                            inputProps={{ min: today }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon sx={{ color: THEME.primary }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="Preferred Time *" name="time" type="time"
                            value={form.time} onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <TimeIcon sx={{ color: THEME.primary }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl fullWidth required>
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
                          <Grid item xs={12}>
                            <TextField
                              fullWidth label="Service Address *" name="locationDetail"
                              value={form.locationDetail} onChange={handleChange}
                              placeholder="Full address of venue or home"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocationIcon sx={{ color: '#ff9800' }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </motion.div>
                  )}

                  {/* ── Step 2: Review ── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={slideVariants}
                      initial="enter" animate="center" exit="exit"
                      transition={{ duration: 0.32 }}
                    >
                      <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3}>
                        📋 Review & Confirm
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 4,
                          bgcolor: `${THEME.primary}08`,
                          borderColor: `${THEME.primary}30`,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700} color={THEME.primary} mb={2}>
                          Booking Summary
                        </Typography>
                        <Grid container spacing={1.5}>
                          {[
                            { label: 'Name',     value: form.fullName },
                            { label: 'Email',    value: form.email },
                            { label: 'Phone',    value: form.phone },
                            { label: 'Service',  value: serviceLabel(form.service1) },
                            form.service2 && { label: 'Add-on', value: serviceLabel(form.service2) },
                            { label: 'Date',     value: form.date },
                            { label: 'Time',     value: form.time },
                            { label: 'Type',     value: form.appointmentType === 'on-location' ? 'On-Location' : 'In-Studio' },
                            form.locationDetail && { label: 'Address', value: form.locationDetail },
                          ].filter(Boolean).map((row) => (
                            <Grid item xs={12} sm={6} key={row.label}>
                              <Stack direction="row" spacing={1}>
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 65, fontWeight: 500 }}>
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
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth label="Occasion (optional)" name="occasion"
                            value={form.occasion} onChange={handleChange}
                            placeholder="e.g., Wedding, Birthday, Graduation"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth label="Notes / Special Requests" name="notes"
                            value={form.notes} onChange={handleChange}
                            multiline rows={4}
                            placeholder="Any specific requests, allergies, or things we should know…"
                          />
                        </Grid>
                      </Grid>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <Box
                  sx={{
                    display: 'flex', justifyContent: step === 0 ? 'flex-end' : 'space-between',
                    mt: 5, gap: 2, flexWrap: 'wrap',
                  }}
                >
                  {step > 0 && (
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => setStep((s) => s - 1)}
                      sx={{
                        borderRadius: '999px', px: { xs: 3, md: 4 },
                        borderColor: THEME.primary, color: THEME.primary,
                        '&:hover': { bgcolor: `${THEME.primary}10` },
                      }}
                    >
                      Back
                    </Button>
                  )}
                  {step < 2 ? (
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={nextStep}
                      sx={{
                        borderRadius: '999px', px: { xs: 4, md: 5 }, py: 1.3,
                        background: THEME.gradient, fontWeight: 700,
                        boxShadow: '0 4px 20px rgba(0,182,173,0.35)',
                        '&:hover': { opacity: 0.9, transform: 'translateY(-1px)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={loading ? null : <CheckCircleIcon />}
                      onClick={submit}
                      disabled={loading}
                      sx={{
                        borderRadius: '999px', px: { xs: 4, md: 5 }, py: 1.5,
                        background: THEME.gradient, fontWeight: 700, fontSize: '1rem',
                        boxShadow: '0 4px 20px rgba(0,182,173,0.35)',
                        '&:hover': { opacity: 0.9, transform: 'translateY(-1px)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      {loading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={20} sx={{ color: '#fff' }} />
                          <span>Sending…</span>
                        </Stack>
                      ) : 'Submit Booking Request'}
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HOME PAGE
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
            <Typography variant="h4" fontWeight={800} color={THEME.darkText}>
              Our Signature Services
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 500, mx: 'auto' }}>
              We specialize in enhancing your natural beauty for every moment that matters.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {SERVICES_DATA.map((s, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
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

      {/* Booking */}
      <BookingForm />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 5, md: 7 },
          background: THEME.gradientWarm,
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4} textAlign={{ xs: 'center', md: 'left' }}>
              <Typography variant="h5" fontWeight={800} mb={0.5}>Pabett Beauty</Typography>
              <Typography variant="body2" sx={{ opacity: 0.6, maxWidth: 260 }}>
                Professional beauty services in Accra. Bridal, makeup, hair & more.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="body2" sx={{ opacity: 0.55 }}>
                Mon – Sat &nbsp;·&nbsp; 9:00 AM – 6:00 PM
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.55, mt: 0.5 }}>
                Dansoman, Accra, Ghana
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign={{ xs: 'center', md: 'right' }}>
              <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <Button
                  href="https://wa.me/233571901526"
                  startIcon={<WhatsAppIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '999px', '&:hover': { borderColor: '#fff' } }}
                >
                  WhatsApp
                </Button>
                <Button
                  href="https://www.instagram.com/pabett"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<InstagramIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '999px', '&:hover': { borderColor: '#fff' } }}
                >
                  Instagram
                </Button>
                <Button
                  href="https://www.facebook.com/pabett"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<FacebookIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '999px', '&:hover': { borderColor: '#fff' } }}
                >
                  Facebook
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 3 }} />
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.45 }}>
            © {new Date().getFullYear()} Pabett Beauty. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}