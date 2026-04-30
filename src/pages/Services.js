import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api/api';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia,
  List, ListItem, ListItemIcon, ListItemText, Button, Divider,
  Chip, Tabs, Tab, Paper, Stack, Accordion, AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircleOutline, Layers, PriceCheck,
  ExpandMore as ExpandMoreIcon,
  ContentCut as ScissorsIcon,
  AutoAwesome as GlamourIcon,
  ArrowForward as ArrowForwardIcon,
  WhatsApp as WhatsAppIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

// ─────────────────────────────────────────────────────────────────────────────
const PRIMARY   = '#00B6AD';
const DARK_TEXT = '#2C3E64';
const LIGHT_BG  = '#F7F9FB';
const GRADIENT  = 'linear-gradient(135deg, #00B6AD 0%, #007B76 100%)';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.15 } },
};

// ─────────────────────────────────────────────────────────────────────────────
const SERVICES_FALLBACK = [
  {
    id: 1,
    slug: 'hair',
    title: 'Hair Styling',
    tagline: 'Healthy hair, beautiful you.',
    description: 'Professional hair styling for all occasions — from everyday elegance to show-stopping bridal looks. We care for every texture and length.',
    image: '/images/Caro-services/Hair-styling.jpg',
    icon: <ScissorsIcon />,
    color: '#00B6AD',
    features: ['Bridal hairstyling', 'Evening & party looks', 'Hair extensions', 'Deep conditioning treatments', 'Professional consultations'],
    pricing: [
      { name: 'Box Braids',            price: 'GHS 250+' },
      { name: 'Cornrows',              price: 'GHS 150+' },
      { name: 'Weave Installation',    price: 'GHS 300+' },
      { name: 'Natural Hair Treatment',price: 'GHS 200+' },
    ],
    duration: '1 – 5 hrs',
  },
  {
    id: 2,
    slug: 'wigs',
    title: 'Wig Units',
    tagline: 'Custom-fitted, flawlessly styled.',
    description: 'Premium wig units and caps crafted to your exact specifications. From lace fronts to full 360 frontals — every unit is a masterpiece.',
    image: '/images/Caps/cap8.jpg',
    icon: <Layers />,
    color: '#9c27b0',
    features: ['Custom fittings & measurements', 'Premium lace & HD fronts', 'Natural-looking hairlines', '360 frontal installation', 'Post-install maintenance tips'],
    pricing: [
      { name: 'Lace Front Installation',  price: 'GHS 350+' },
      { name: 'Closure Installation',     price: 'GHS 300+' },
      { name: '360 Frontal Installation', price: 'GHS 400+' },
      { name: 'Custom Wig Styling',       price: 'GHS 250+' },
    ],
    duration: '2 – 4 hrs',
  },
  {
    id: 3,
    slug: 'makeup',
    title: 'Makeup Services',
    tagline: 'Flawless finish every time.',
    description: 'Expert makeup application using premium, skin-safe products. Whether you\'re walking the aisle or the red carpet, we deliver stunning results.',
    image: '/images/Caro-services/Makeup-services.jpg',
    icon: <GlamourIcon />,
    color: '#e91e8c',
    features: ['Airbrush makeup', 'Full bridal packages', 'Editorial & photoshoot looks', 'Skincare prep & primer', 'Touch-up kits included'],
    pricing: [
      { name: 'Bridal Makeup',    price: 'GHS 400+' },
      { name: 'Evening Makeup',   price: 'GHS 300+' },
      { name: 'Editorial Makeup', price: 'GHS 500+' },
      { name: 'Basic Glam',       price: 'GHS 200+' },
    ],
    duration: '1 – 3 hrs',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 1–2 weeks in advance. For bridal services, 4–8 weeks is ideal to secure your preferred date.',
  },
  {
    q: 'Do you offer on-location services?',
    a: 'Yes! Our mobile team can come to your home, hotel, or event venue anywhere in Accra. A travel fee may apply depending on the location.',
  },
  {
    q: 'What happens if I need to reschedule?',
    a: 'We understand life happens. Please contact us at least 48 hours before your appointment to reschedule without any extra charge.',
  },
  {
    q: 'Are the products you use skin-safe?',
    a: 'Absolutely. We use only premium, dermatologist-approved products and can accommodate sensitivities — just let us know when booking.',
  },
  {
    q: 'Do you offer group or bridal party packages?',
    a: 'Yes, we offer special group pricing for bridal parties, events, and corporate engagements. Contact us for a custom quote.',
  },
];

const PROCESS = [
  { step: 1, icon: '📋', title: 'Consultation',  desc: 'We discuss your vision, skin type and preferred look — in person or virtually.' },
  { step: 2, icon: '📅', title: 'Booking',       desc: 'Secure your appointment with a confirmed date, time and location.' },
  { step: 3, icon: '✨', title: 'Service',        desc: 'Relax while our experts work their magic with premium products.' },
  { step: 4, icon: '💬', title: 'Follow-up',      desc: 'We check in after your service to ensure you are 100% satisfied.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CARD
// ─────────────────────────────────────────────────────────────────────────────
const ServiceCard = ({ service, isActive, onClick }) => (
  <motion.div variants={fadeUp}>
    <Card
      onClick={onClick}
      sx={{
        height: '100%', borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
        boxShadow: isActive
          ? `0 12px 40px ${service.color}30`
          : '0 4px 16px rgba(0,0,0,0.07)',
        border: isActive ? `2px solid ${service.color}` : '2px solid transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0 12px 40px ${service.color}25`,
        },
        display: 'flex', flexDirection: 'column',
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="220"
          image={service.image}
          alt={service.title}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.06)' },
          }}
        />
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to top, ${service.color}cc 0%, transparent 55%)`,
          }}
        />
        <Box
          sx={{
            position: 'absolute', bottom: 14, left: 16,
            display: 'flex', alignItems: 'center', gap: 1,
          }}
        >
          <Box sx={{ bgcolor: '#fff', borderRadius: '50%', p: 0.7, color: service.color, display: 'flex' }}>
            {service.icon}
          </Box>
          <Typography variant="h6" color="#fff" fontWeight={700}>{service.title}</Typography>
        </Box>
        {isActive && (
          <Chip
            label="Viewing"
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, bgcolor: service.color, color: '#fff', fontWeight: 700 }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1.5 }}>
          {service.tagline}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
          {service.description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [activeTab,  setActiveTab]  = useState(0);
  const [services,   setServices]   = useState(SERVICES_FALLBACK);

  useEffect(() => {
    fetch(`${BASE_URL}/api/services`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length) setServices(data); })
      .catch(() => {});
  }, []);

  const service = services[activeTab] || services[0];

  return (
    <Box>
      {/* ── Hero ── */}
      <Box
        sx={{
          height: { xs: '56vh', md: '65vh' },
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', bgcolor: DARK_TEXT,
        }}
      >
        <Box
          component="img"
          src="/images/Caro-services/Hair-styling.jpg"
          alt="Services Hero"
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.38)',
          }}
        />
        {/* Teal gradient overlay */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(0,182,173,0.35) 0%, transparent 60%)',
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', px: 3 }}>
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label="PABETT BEAUTY"
              sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, letterSpacing: 1.5, backdropFilter: 'blur(4px)' }}
            />
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.2rem' }, fontWeight: 800, mb: 1.5, lineHeight: 1.1 }}
            >
              Our Premium Services
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.82, maxWidth: 560, mx: 'auto', fontSize: { xs: '1rem', md: '1.2rem' } }}>
              Professional beauty treatments tailored to your unique style and occasion.
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={4}>
              <Button
                href="/#booking-form"
                variant="contained"
                size="large"
                startIcon={<ScheduleIcon />}
                sx={{
                  bgcolor: PRIMARY, borderRadius: '999px', px: 4, py: 1.4,
                  fontWeight: 700, boxShadow: '0 6px 24px rgba(0,182,173,0.4)',
                  '&:hover': { bgcolor: '#009688' },
                }}
              >
                Book a Service
              </Button>
              <Button
                href="https://wa.me/233571901526"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: '#fff', borderColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '999px', px: 4, py: 1.4,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Chat with Us
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ── Services Overview Grid ── */}
      <Box sx={{ py: { xs: 7, md: 11 }, bgcolor: LIGHT_BG }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="WHAT WE OFFER" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" component="h2" fontWeight={800} color={DARK_TEXT} gutterBottom>
              Featured Beauty Services
            </Typography>
            <Box sx={{ width: 56, height: 4, bgcolor: PRIMARY, borderRadius: 2, mx: 'auto', mt: 1 }} />
          </Box>

          {/* Tab selector */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 5, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              textColor="inherit"
              sx={{
                '& .MuiTab-root': { fontWeight: 600, fontSize: '0.95rem', textTransform: 'none', px: 3, py: 1.5 },
                '& .MuiTabs-indicator': { bgcolor: PRIMARY, height: 3, borderRadius: 2 },
                '& .Mui-selected': { color: PRIMARY },
              }}
            >
              {services.map((s) => (
                <Tab
                  key={s.id}
                  label={
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Box sx={{ color: 'inherit', display: 'flex', fontSize: 18 }}>{s.icon}</Box>
                      <span>{s.title}</span>
                    </Stack>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Active service detail */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Grid container spacing={4} alignItems="flex-start">
              {/* Image */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    borderRadius: 4, overflow: 'hidden',
                    boxShadow: `0 16px 48px ${service.color}20`,
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={service.image}
                    alt={service.title}
                    sx={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 420 }}
                  />
                  <Box
                    sx={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      p: 2, background: `linear-gradient(to top, ${service.color}dd, transparent)`,
                    }}
                  >
                    <Typography color="#fff" fontWeight={700}>{service.title}</Typography>
                    <Typography color="rgba(255,255,255,0.8)" variant="body2">{service.tagline}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Features & pricing */}
              <Grid item xs={12} md={7}>
                <Stack spacing={1} mb={2.5} direction="row" alignItems="center">
                  <Box sx={{ bgcolor: `${service.color}15`, p: 1, borderRadius: 2, color: service.color, display: 'flex' }}>
                    {service.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color={DARK_TEXT}>{service.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Approx. duration: {service.duration}</Typography>
                  </Box>
                </Stack>
                <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>{service.description}</Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      sx={{
                        p: 2.5, borderRadius: 3, height: '100%',
                        border: `1px solid ${service.color}20`,
                        boxShadow: 'none',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700} color={service.color} mb={1.5}>
                        What's Included
                      </Typography>
                      <List dense disablePadding>
                        {service.features.map((f, i) => (
                          <ListItem key={i} disableGutters sx={{ py: 0.4 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckCircleOutline sx={{ fontSize: 16, color: service.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={f}
                              primaryTypographyProps={{ fontSize: '0.9rem', color: DARK_TEXT }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      sx={{
                        p: 2.5, borderRadius: 3, height: '100%',
                        bgcolor: `${service.color}07`,
                        border: `1px solid ${service.color}20`,
                        boxShadow: 'none',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700} color={service.color} mb={1.5}>
                        Starting Prices
                      </Typography>
                      <List dense disablePadding>
                        {service.pricing.map((p, i) => (
                          <ListItem key={i} disableGutters sx={{ py: 0.5, borderBottom: '1px dotted rgba(0,0,0,0.08)' }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <PriceCheck sx={{ fontSize: 15, color: DARK_TEXT }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={p.name}
                              secondary={p.price}
                              primaryTypographyProps={{ fontSize: '0.85rem', color: DARK_TEXT }}
                              secondaryTypographyProps={{ fontSize: '0.85rem', color: service.color, fontWeight: 700 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>

                <Button
                  href="/#booking-form"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 3, bgcolor: service.color, borderRadius: '999px', px: 4, fontWeight: 700,
                    boxShadow: `0 4px 18px ${service.color}40`,
                    '&:hover': { filter: 'brightness(0.9)' },
                  }}
                >
                  Book {service.title}
                </Button>
              </Grid>
            </Grid>
          </motion.div>

          {/* Service cards row */}
          <Divider sx={{ my: 7 }} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Grid container spacing={3}>
              {services.map((s, i) => (
                <Grid item xs={12} sm={6} md={4} key={s.id}>
                  <ServiceCard
                    service={s}
                    isActive={i === activeTab}
                    onClick={() => setActiveTab(i)}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── Our Process ── */}
      <Box sx={{ py: { xs: 7, md: 11 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Chip label="HOW IT WORKS" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" component="h2" fontWeight={800} color={DARK_TEXT}>
              Our Professional Process
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {PROCESS.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={step.step}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <Paper
                    sx={{
                      p: 3.5, borderRadius: 4, textAlign: 'center', height: '100%',
                      position: 'relative', border: '1px solid #edf2f7',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      '&:hover': { boxShadow: `0 8px 32px ${PRIMARY}15`, transform: 'translateY(-4px)' },
                    }}
                  >
                    {/* Step number connector line */}
                    {i < PROCESS.length - 1 && (
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          position: 'absolute', top: 44, right: -24, zIndex: 1,
                          width: 48, height: 2, bgcolor: `${PRIMARY}30`,
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: GRADIENT,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: '1.3rem', mb: 2,
                        boxShadow: `0 4px 16px ${PRIMARY}40`,
                      }}
                    >
                      {step.step}
                    </Box>
                    <Typography variant="h6" fontWeight={700} color={DARK_TEXT} gutterBottom>{step.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>{step.desc}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FAQ ── */}
      <Box sx={{ py: { xs: 7, md: 11 }, bgcolor: LIGHT_BG }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Chip label="FAQ" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" component="h2" fontWeight={800} color={DARK_TEXT}>
              Frequently Asked Questions
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            {FAQS.map((faq, i) => (
              <Accordion
                key={i}
                disableGutters
                elevation={0}
                sx={{
                  borderRadius: '12px !important',
                  border: '1px solid #e8f0ef',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { boxShadow: `0 4px 20px ${PRIMARY}15` },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY }} />}
                  sx={{
                    px: 3, py: 0.5,
                    '& .MuiAccordionSummary-content': { my: 1.5 },
                    '&.Mui-expanded': { bgcolor: `${PRIMARY}06` },
                  }}
                >
                  <Typography fontWeight={600} color={DARK_TEXT}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #2C3E64 0%, #1a2a4a 100%)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Decorative circle */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: `${PRIMARY}18`, pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <Typography variant="h3" color="#fff" fontWeight={800} sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' } }} mb={1.5}>
              Ready for Your Transformation?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', mb: 4, maxWidth: 500, mx: 'auto', fontSize: '1.05rem' }}>
              Book a consultation today and let our experts create your perfect look.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                href="/#booking-form"
                variant="contained"
                size="large"
                startIcon={<ScheduleIcon />}
                sx={{
                  bgcolor: PRIMARY, borderRadius: '999px', px: 5, py: 1.6,
                  fontWeight: 700, fontSize: '1.05rem',
                  boxShadow: '0 6px 24px rgba(0,182,173,0.4)',
                  '&:hover': { bgcolor: '#009688', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s',
                }}
              >
                Schedule Appointment
              </Button>
              <Button
                href="https://wa.me/233571901526"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: '#fff', borderColor: 'rgba(255,255,255,0.55)',
                  borderRadius: '999px', px: 5, py: 1.6, fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: '#fff' },
                }}
              >
                Chat on WhatsApp
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}