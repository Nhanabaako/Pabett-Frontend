import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Spa as SpaIcon,
  WhatsApp as WhatsAppIcon,
  EventAvailable as EventIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
import Testimonials from './Testimonials';

// -----------------------------
// Constants & Data
// -----------------------------
const THEME = {
  primary: '#00B6AD',
  darkText: '#2C3E64',
  lightBg: '#F7F9FB',
};

const slides = [
  {
    image: 'images/caro-services/Caro1.jpg',
    title: 'Elevate Your Look, Effortlessly',
    subtitle: 'Expert styling for natural radiance and glamour.',
    cta: 'Book Consultation',
  },
  {
    image: 'images/caro-services/Caro2.jpg',
    title: 'Personalized Glamour for Every Event',
    subtitle: 'Bespoke makeup and hair services tailored to your occasion.',
    cta: 'Explore Services',
  },
  {
    image: 'images/caro-services/Caro4.jpg',
    title: 'Luxury Beauty Experience',
    subtitle: "Book your appointment for exceptional, professional care.",
    cta: 'Reserve Your Slot',
  },
  {
    image: 'images/Pabett oil Flier.png',
    title: 'PABETT Hair Growth Oil',
    subtitle: 'Nourish. Strengthen. Grow. Shop our signature hair oil.',
    cta: 'Shop Now',
  },
];

const definedServices = [
  { value: 'event_makeup', label: 'Event Makeup (Photoshoot, Party)' },
  { value: 'bridal_makeup', label: 'Bridal Makeup' },
  { value: 'hairstyling', label: 'Hair Styling & Treatments' },
  { value: 'wig-units', label: 'Wig Installation/Customization' },
  { value: 'consultation', label: 'Virtual/In-Person Consultation' },
  { value: 'other', label: 'Other' },
];

const services = [
  {
    title: 'Bridal & Event Makeup',
    image: 'images/Caro-services/Makeup-services.jpg',
    description: 'Flawless, long-lasting looks for weddings, photoshoots and special occasions.',
    link: '/services#makeup',
  },
  {
    title: 'Hair Styling & Treatments',
    image: 'images/Caro-services/Hair-styling.jpg',
    description: 'From elegant updos to deep conditioning — complete hair transformations.',
    link: '/services#hair',
  },
  {
    title: 'Wig Units & Customization',
    image: 'images/Caps/cap8.jpg',
    description: 'Custom unit construction, installation and precise styling for a natural look.',
    link: '/services#wigs',
  },
];

// -----------------------------
// Small, reusable components
// -----------------------------
const Hero = () => (
  <Box sx={{ height: { xs: '60vh', md: '90vh' }, width: '100%', overflow: 'hidden' }}>
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectCreative]}
      effect="creative"
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      navigation
      loop
      pagination={{ clickable: true }}
      creativeEffect={{ prev: { translate: ['-120%', 0, -500] }, next: { translate: ['120%', 0, -500] } }}
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
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.7))',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                px: 3,
                pb: { xs: 6, md: 12 },
                textAlign: 'center',
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
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: 3,
      transition: 'transform 0.28s ease, box-shadow 0.28s ease',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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

// -----------------------------
// Booking form component (self-contained)
// -----------------------------
const BookingForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    service1: '',
    service2: '',
    appointmentType: '',
    locationDetail: '',
    date: '',
    time: '',
    occasion: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 15);
      setForm((p) => ({ ...p, [name]: digits }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const phoneValid = useMemo(() => form.phone.length >= 10, [form.phone]);

  const availableSecondary = useMemo(
    () => definedServices.filter((s) => s.value !== form.service1),
    [form.service1]
  );

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      // Basic validation
      if (!form.fullName || !form.email || !form.date || !form.time || !form.service1 || !form.appointmentType || !form.phone) {
        Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please complete all required fields.', confirmButtonColor: THEME.primary });
        setLoading(false);
        return;
      }

      if (form.appointmentType === 'on-location' && !form.locationDetail) {
        Swal.fire({ icon: 'warning', title: 'Address Required', text: 'Please provide the service address for on-location bookings.', confirmButtonColor: THEME.primary });
        setLoading(false);
        return;
      }

      if (!phoneValid) {
        Swal.fire({ icon: 'warning', title: 'Phone Number', text: 'Enter a valid phone number (min 10 digits).', confirmButtonColor: THEME.primary });
        setLoading(false);
        return;
      }

      try {
     const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api/booking'
    : `${process.env.REACT_APP_API_URL}/api/booking`;

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Server error');
        }

        const resJson = await response.json();
        Swal.fire({ icon: 'success', title: 'Booking Sent', text: resJson.message || 'We will contact you to confirm.', confirmButtonColor: THEME.primary });

        // Reset
        setForm({ fullName: '', email: '', phone: '', service1: '', service2: '', appointmentType: '', locationDetail: '', date: '', time: '', occasion: '', notes: '' });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message || 'Please try again later or contact us on WhatsApp.', confirmButtonColor: THEME.primary });
      } finally {
        setLoading(false);
      }
    },
    [form, phoneValid]
  );

  return (
    <Container maxWidth="md" sx={{ my: { xs: 4, md: 10 } }}>
      <Paper sx={{ p: { xs: 2, md: 5 }, borderRadius: 3, boxShadow: 6 }} component="form" onSubmit={submit}>
        <Typography id="booking-form" variant="h4" textAlign="center" sx={{ fontWeight: 700, mb: 1 }}>
          Request Your Appointment
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Fill the form and we will reach out within 24 hours to confirm your booking.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name *" name="fullName" value={form.fullName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email Address *" name="email" value={form.email} onChange={handleChange} type="email" required />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primary Phone Number *"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g., 024XXXXXXXX"
              required
              error={form.phone !== '' && !phoneValid}
              helperText={form.phone !== '' && !phoneValid ? 'Minimum 10 digits' : ''}
              InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} /> }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="service1-label">Primary Service *</InputLabel>
              <Select labelId="service1-label" name="service1" value={form.service1} label="Primary Service *" onChange={handleChange}>
                <MenuItem value="">Select</MenuItem>
                {definedServices.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!form.service1}>
              <InputLabel id="service2-label">Additional Service (optional)</InputLabel>
              <Select labelId="service2-label" name="service2" value={form.service2} label="Additional Service (optional)" onChange={handleChange}>
                <MenuItem value="">None</MenuItem>
                {availableSecondary.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Preferred Date *" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required InputProps={{ startAdornment: <EventIcon sx={{ mr: 1 }} /> }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Preferred Time *" name="time" type="time" value={form.time} onChange={handleChange} InputLabelProps={{ shrink: true }} required InputProps={{ startAdornment: <TimeIcon sx={{ mr: 1 }} /> }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel id="appt-type-label">Appointment Type *</InputLabel>
              <Select labelId="appt-type-label" name="appointmentType" value={form.appointmentType} label="Appointment Type *" onChange={handleChange}>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="in-studio">In-Studio</MenuItem>
                <MenuItem value="on-location">On-Location (mobile)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {form.appointmentType === 'on-location' && (
            <Grid item xs={12}>
              <TextField fullWidth label="Service Address *" name="locationDetail" value={form.locationDetail} onChange={handleChange} placeholder="Full address of venue or home" required InputProps={{ startAdornment: <LocationIcon sx={{ mr: 1 }} /> }} />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField fullWidth label="Occasion (optional)" name="occasion" value={form.occasion} onChange={handleChange} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Notes / Special Requests" name="notes" value={form.notes} onChange={handleChange} multiline rows={4} />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: THEME.primary, borderRadius: '999px', px: 4, py: 1.25 }}>
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} sx={{ color: '#fff' }} />
                    <Typography color="#fff">Processing...</Typography>
                  </Stack>
                ) : (
                  'Submit Booking Request'
                )}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// -----------------------------
// Main Page
// -----------------------------
export default function Home() {
  return (
    <Box sx={{ bgcolor: THEME.lightBg }}>
      <Hero />

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
            {services.map((s, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <ServiceCard item={s} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 4, md: 8 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Testimonials />
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
        <BookingForm />
      </Box>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', bgcolor: THEME.darkText, color: '#fff' }}>
        <Container maxWidth="lg">
          <Typography>© {new Date().getFullYear()} Pabett Beauty. All rights reserved.</Typography>
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
            <Button href="https://wa.me/233571901526" startIcon={<WhatsAppIcon />} sx={{ color: '#fff' }}>
              Contact on WhatsApp
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
