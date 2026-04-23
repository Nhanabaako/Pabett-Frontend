import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Container, Grid, Card, CardMedia, CardContent,
  Typography, Button, Stack, Paper, TextField, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Step, Stepper,
  StepLabel, Divider, Chip, InputAdornment,
} from '@mui/material';
import {
  Spa         as SpaIcon,
  WhatsApp    as WhatsAppIcon,
  EventAvailable as EventIcon,
  AccessTime  as TimeIcon,
  LocationOn  as LocationIcon,
  Phone       as PhoneIcon,
  Person      as PersonIcon,
  Email       as EmailIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack   as ArrowBackIcon,
  Notes       as NotesIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
import Testimonials from './Testimonials';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const THEME = {
  primary:  '#00B6AD',
  darkText: '#2C3E64',
  lightBg:  '#F7F9FB',
};

const BOOKING_API =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api/booking'
    : `${process.env.REACT_APP_API_URL}/api/booking`;

const slides = [
  {
    image:    'images/caro-services/Caro1.jpg',
    title:    'Elevate Your Look, Effortlessly',
    subtitle: 'Expert styling for natural radiance and glamour.',
    cta:      'Book Consultation',
  },
  {
    image:    'images/caro-services/Caro2.jpg',
    title:    'Personalized Glamour for Every Event',
    subtitle: 'Bespoke makeup and hair services tailored to your occasion.',
    cta:      'Explore Services',
  },
  {
    image:    'images/caro-services/Caro4.jpg',
    title:    'Luxury Beauty Experience',
    subtitle: 'Book your appointment for exceptional, professional care.',
    cta:      'Reserve Your Slot',
  },
  {
    image:    'images/Pabett oil Flier.png',
    title:    'PABETT Hair Growth Oil',
    subtitle: 'Nourish. Strengthen. Grow. Shop our signature hair oil.',
    cta:      'Shop Now',
  },
];

const SERVICES = [
  { value: 'event_makeup',  label: 'Event Makeup',                icon: '💄' },
  { value: 'bridal_makeup', label: 'Bridal Makeup',               icon: '👰' },
  { value: 'hairstyling',   label: 'Hair Styling & Treatments',   icon: '💇' },
  { value: 'wig-units',     label: 'Wig Installation/Customization', icon: '✂️' },
  { value: 'consultation',  label: 'Consultation',                icon: '🗓️' },
  { value: 'other',         label: 'Other',                       icon: '🌸' },
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
];

const OCCASIONS = [
  'Wedding', 'Birthday Party', 'Graduation', 'Baby Shower',
  'Engagement', 'Corporate Event', 'Photoshoot', 'Prom / Formal',
  'Anniversary', 'Other',
];

const STEPS = ['Your Details', 'Service & Schedule', 'Confirm & Send'];

const serviceCards = [
  {
    title:       'Bridal & Event Makeup',
    image:       'images/Caro-services/Makeup-services.jpg',
    description: 'Flawless, long-lasting looks for weddings, photoshoots and special occasions.',
    link:        '/services#makeup',
  },
  {
    title:       'Hair Styling & Treatments',
    image:       'images/Caro-services/Hair-styling.jpg',
    description: 'From elegant updos to deep conditioning — complete hair transformations.',
    link:        '/services#hair',
  },
  {
    title:       'Wig Units & Customization',
    image:       'images/Caps/cap8.jpg',
    description: 'Custom unit construction, installation and precise styling for a natural look.',
    link:        '/services#wigs',
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const Hero = () => (
  <Box sx={{ height: { xs: '60vh', md: '90vh' }, width: '100%', overflow: 'hidden' }}>
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectCreative]}
      effect="creative"
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      navigation
      loop
      pagination={{ clickable: true }}
      creativeEffect={{
        prev: { translate: ['-120%', 0, -500] },
        next: { translate: ['120%', 0, -500] },
      }}
      style={{ height: '100%', width: '100%' }}
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i}>
          <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <motion.img
              src={s.image}
              alt={s.title}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              style={{ width: '100%', height: '200%', objectFit: 'cover', objectPosition: 'center 10%' }}
            />
            <Box
              sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                px: 3, pb: { xs: 6, md: 12 }, textAlign: 'center',
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.8rem' } }}>
                  {s.title}
                </Typography>
                <Typography sx={{ color: '#eee', maxWidth: 900, fontSize: { xs: '0.95rem', md: '1.15rem' } }}>
                  {s.subtitle}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    href="#booking-form"
                    variant="contained"
                    size="large"
                    sx={{ bgcolor: THEME.primary, borderRadius: '999px', px: 4, py: 1.25 }}
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
                    sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)', borderRadius: '999px' }}
                  >
                    Chat Now
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  </Box>
);

const ServiceCard = ({ item }) => (
  <Card
    sx={{
      borderRadius: 3, overflow: 'hidden', boxShadow: 3,
      transition: 'transform 0.28s ease, box-shadow 0.28s ease',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
      height: '100%', display: 'flex', flexDirection: 'column',
    }}
  >
    <CardMedia component="img" image={item.image} alt={item.title} sx={{ height: 220, objectFit: 'cover' }} />
    <CardContent sx={{ flexGrow: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Box sx={{ bgcolor: THEME.primary, p: 1, borderRadius: '50%' }}>
          <SpaIcon sx={{ color: '#fff' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.darkText }}>
          {item.title}
        </Typography>
      </Stack>
      <Typography color="text.secondary" sx={{ minHeight: 56 }}>
        {item.description}
      </Typography>
      <Button href={item.link} size="small" sx={{ mt: 2, color: THEME.primary, fontWeight: 600 }}>
        Learn More
      </Button>
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────
// Booking Form — 3-step stepper
// ─────────────────────────────────────────────
const EMPTY_FORM = {
  fullName: '', email: '', phone: '',
  service1: '', service2: '',
  appointmentType: '', locationDetail: '',
  date: '', time: '',
  occasion: '', notes: '',
};

function BookingForm() {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [step,    setStep]    = useState(0);   // 0 | 1 | 2
  const [loading, setLoading] = useState(false);
  const formRef               = useRef(null);

  // scroll to form when navigated with state
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.scrollToBooking && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setForm((p) => ({ ...p, phone: value.replace(/\D/g, '').slice(0, 15) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const phoneValid = useMemo(() => form.phone.length >= 10, [form.phone]);
  const today      = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const secondaryServices = useMemo(
    () => SERVICES.filter((s) => s.value !== form.service1),
    [form.service1],
  );

  // ── per-step validation ──────────────────────────────────────────
  const validateStep = (s) => {
    if (s === 0) {
      if (!form.fullName.trim()) return 'Please enter your full name.';
      if (!form.email.trim())    return 'Please enter your email address.';
      if (!phoneValid)           return 'Please enter a valid phone number (min 10 digits).';
    }
    if (s === 1) {
      if (!form.service1)        return 'Please select a primary service.';
      if (!form.date)            return 'Please choose a preferred date.';
      if (!form.time)            return 'Please choose a preferred time.';
      if (!form.appointmentType) return 'Please select an appointment type.';
      if (form.appointmentType === 'on-location' && !form.locationDetail.trim())
        return 'Please provide the service address for on-location bookings.';
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep(step);
    if (err) {
      Swal.fire({ icon: 'warning', title: 'Almost there!', text: err, confirmButtonColor: THEME.primary });
      return;
    }
    setStep((s) => s + 1);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── submit ───────────────────────────────────────────────────────
  const submit = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(BOOKING_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Server error');
      }

      const json = await res.json();
      Swal.fire({
        icon:             'success',
        title:            '🎉 Booking Request Sent!',
        text:             json.message || 'We will contact you within 24 hours to confirm.',
        confirmButtonColor: THEME.primary,
      });
      setForm(EMPTY_FORM);
      setStep(0);
    } catch (err) {
      Swal.fire({
        icon:             'error',
        title:            'Submission Failed',
        text:             err.message || 'Please try again or contact us on WhatsApp.',
        confirmButtonColor: THEME.primary,
      });
    } finally {
      setLoading(false);
    }
  }, [form]);

  const serviceMeta = SERVICES.find((s) => s.value === form.service1);

  // ── helper: label chip ───────────────────────────────────────────
  const SummaryRow = ({ label, value }) =>
    value ? (
      <Box display="flex" alignItems="flex-start" gap={1.5} mb={1.5}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" color={THEME.darkText} fontWeight={500}>
          {value}
        </Typography>
      </Box>
    ) : null;

  return (
    <Container maxWidth="md" sx={{ my: { xs: 4, md: 10 } }} ref={formRef}>
      <Paper
        id="booking-form"
        elevation={4}
        sx={{ p: { xs: 2.5, md: 5 }, borderRadius: 4, overflow: 'hidden' }}
      >
        {/* Title */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={800} color={THEME.darkText}>
            Request Your Appointment
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Fill in the form and we will reach out within 24 hours to confirm.
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-completed, &.Mui-active': { color: THEME.primary },
                  },
                }}
              >
                <Typography variant="caption" fontWeight={600}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* ── Step 0: Personal Details ────────────────────────────── */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
            <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3}>
              👤 Personal Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name *"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: THEME.primary }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: THEME.primary }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number *"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. 024XXXXXXXX"
                  error={form.phone !== '' && !phoneValid}
                  helperText={form.phone !== '' && !phoneValid ? 'Minimum 10 digits required' : 'Digits only — no spaces or dashes'}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: THEME.primary }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* ── Step 1: Service & Schedule ──────────────────────────── */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
            <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3}>
              💄 Service & Schedule
            </Typography>
            <Grid container spacing={3}>

              {/* Service selector cards */}
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight={600} mb={1.5} color="text.secondary">
                  Primary Service *
                </Typography>
                <Grid container spacing={1.5}>
                  {SERVICES.map((s) => (
                    <Grid item xs={6} sm={4} key={s.value}>
                      <Box
                        onClick={() => setForm((p) => ({ ...p, service1: s.value, service2: p.service2 === s.value ? '' : p.service2 }))}
                        sx={{
                          p: 1.5, borderRadius: 2, cursor: 'pointer', textAlign: 'center',
                          border: `2px solid ${form.service1 === s.value ? THEME.primary : '#e0e0e0'}`,
                          bgcolor: form.service1 === s.value ? 'rgba(0,182,173,0.07)' : '#fff',
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: THEME.primary, bgcolor: 'rgba(0,182,173,0.05)' },
                        }}
                      >
                        <Typography fontSize="1.4rem">{s.icon}</Typography>
                        <Typography variant="caption" fontWeight={600} color={form.service1 === s.value ? THEME.primary : THEME.darkText}>
                          {s.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Additional service */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!form.service1}>
                  <InputLabel>Additional Service (optional)</InputLabel>
                  <Select
                    name="service2"
                    value={form.service2}
                    label="Additional Service (optional)"
                    onChange={handleChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {secondaryServices.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.icon} {s.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Occasion */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Occasion (optional)</InputLabel>
                  <Select
                    name="occasion"
                    value={form.occasion}
                    label="Occasion (optional)"
                    onChange={handleChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {OCCASIONS.map((o) => (
                      <MenuItem key={o} value={o}>{o}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Date */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Preferred Date *"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: today }}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon sx={{ color: THEME.primary }} /></InputAdornment> }}
                />
              </Grid>

              {/* Time slot picker */}
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" fontWeight={600} mb={1.5} color="text.secondary">
                  Preferred Time * {form.time && <Chip label={form.time} size="small" sx={{ ml: 1, bgcolor: THEME.primary, color: '#fff' }} />}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {TIME_SLOTS.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      onClick={() => setForm((p) => ({ ...p, time: t }))}
                      size="small"
                      sx={{
                        cursor: 'pointer',
                        bgcolor: form.time === t ? THEME.primary : 'transparent',
                        color:   form.time === t ? '#fff' : 'text.secondary',
                        border:  `1px solid ${form.time === t ? THEME.primary : '#ddd'}`,
                        fontWeight: form.time === t ? 700 : 400,
                        '&:hover': { bgcolor: THEME.primary, color: '#fff' },
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Appointment type */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Appointment Type *</InputLabel>
                  <Select
                    name="appointmentType"
                    value={form.appointmentType}
                    label="Appointment Type *"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="in-studio">🏠 In-Studio</MenuItem>
                    <MenuItem value="on-location">📍 On-Location (mobile)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {form.appointmentType === 'on-location' && (
                <Grid item xs={12}>
                  <TextField
                    label="Service Address *"
                    name="locationDetail"
                    value={form.locationDetail}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Full address of venue or home"
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ color: THEME.primary }} /></InputAdornment> }}
                  />
                </Grid>
              )}

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  label="Notes / Special Requests"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Any allergies, preferences, inspirations, or extra details…"
                  InputProps={{ startAdornment: <InputAdornment position="start"><NotesIcon sx={{ color: THEME.primary, alignSelf: 'flex-start', mt: 1 }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* ── Step 2: Confirm ────────────────────────────────────── */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
            <Typography variant="h6" fontWeight={700} color={THEME.darkText} mb={3}>
              ✅ Review & Confirm
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 3, bgcolor: '#fafefe', mb: 3, borderColor: THEME.primary + '44' }}
            >
              <Typography variant="subtitle2" color={THEME.primary} fontWeight={700} mb={2}>
                Personal Details
              </Typography>
              <SummaryRow label="Name"  value={form.fullName} />
              <SummaryRow label="Email" value={form.email} />
              <SummaryRow label="Phone" value={form.phone} />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" color={THEME.primary} fontWeight={700} mb={2}>
                Appointment Details
              </Typography>
              <SummaryRow
                label="Primary Service"
                value={serviceMeta ? `${serviceMeta.icon} ${serviceMeta.label}` : form.service1}
              />
              {form.service2 && (
                <SummaryRow
                  label="Additional Service"
                  value={SERVICES.find((s) => s.value === form.service2)?.label || form.service2}
                />
              )}
              {form.occasion && <SummaryRow label="Occasion"  value={form.occasion} />}
              <SummaryRow label="Date"     value={form.date} />
              <SummaryRow label="Time"     value={form.time} />
              <SummaryRow
                label="Type"
                value={form.appointmentType === 'in-studio' ? '🏠 In-Studio' : '📍 On-Location'}
              />
              {form.locationDetail && <SummaryRow label="Address" value={form.locationDetail} />}
              {form.notes && <SummaryRow label="Notes"   value={form.notes} />}
            </Paper>

            <Box
              sx={{
                p: 2, borderRadius: 2, bgcolor: 'rgba(0,182,173,0.07)',
                border: `1px solid ${THEME.primary}44`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CelebrationIcon sx={{ color: THEME.primary }} />
                <Typography variant="body2" color="text.secondary">
                  By submitting, you agree that we will contact you within <strong>24 hours</strong> to confirm your appointment.
                </Typography>
              </Stack>
            </Box>
          </motion.div>
        )}

        {/* ── Navigation Buttons ───────────────────────────────────── */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={5}>
          <Button
            onClick={prevStep}
            disabled={step === 0}
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: 'none', color: THEME.darkText, visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            Back
          </Button>

          {step < 2 ? (
            <Button
              onClick={nextStep}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: THEME.primary, borderRadius: '999px', px: 4, py: 1.25,
                fontWeight: 600, textTransform: 'none',
                '&:hover': { bgcolor: '#009688' },
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={submit}
              variant="contained"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
              sx={{
                bgcolor: THEME.primary, borderRadius: '999px', px: 4, py: 1.25,
                fontWeight: 600, textTransform: 'none',
                '&:hover': { bgcolor: '#009688' },
              }}
            >
              {loading ? 'Submitting…' : 'Submit Booking'}
            </Button>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function Home() {
  return (
    <Box sx={{ bgcolor: THEME.lightBg }}>
      <Hero />

      {/* Services */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.darkText }}>
              Our Signature Services
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              We specialize in enhancing your natural beauty for every moment.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {serviceCards.map((s, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <ServiceCard item={s} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box component="section" sx={{ py: { xs: 4, md: 8 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Testimonials />
        </Container>
      </Box>

      {/* Booking */}
      <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" fontWeight={800} color={THEME.darkText}>
              Book an Appointment
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Ready for your transformation? Let's make it happen.
            </Typography>
          </Box>
        </Container>
        <BookingForm />
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, textAlign: 'center', bgcolor: THEME.darkText, color: '#fff' }}>
        <Container maxWidth="lg">
          <Typography>© {new Date().getFullYear()} Pabett Beauty. All rights reserved.</Typography>
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
            <Button
              href="https://wa.me/233571901526"
              startIcon={<WhatsAppIcon />}
              sx={{ color: '#fff' }}
            >
              Contact on WhatsApp
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}