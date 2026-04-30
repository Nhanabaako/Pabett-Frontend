import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../api/api';
import { motion } from 'framer-motion';
import {
  Accordion, AccordionDetails, AccordionSummary, Avatar,
  Box, Button, Chip, Container, Divider, Grid, List,
  ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as GlamourIcon,
  CalendarMonth,
  Chat as ChatIcon,
  CheckCircleOutline,
  ContentCut as ScissorsIcon,
  ExpandMore as ExpandMoreIcon,
  Layers,
  LocationOn,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Spa as SpaIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  WhatsApp as WhatsAppIcon,
  WorkspacePremium,
} from '@mui/icons-material';

// ── Theme constants ───────────────────────────────────────────────────────────
const PRIMARY   = '#00B6AD';
const DARK_TEXT = '#2C3E64';
const LIGHT_BG  = '#F7F9FB';
const GRADIENT  = 'linear-gradient(135deg, #00B6AD 0%, #007B76 100%)';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

// ── Static data ───────────────────────────────────────────────────────────────

const SERVICES_FALLBACK = [
  {
    id: 1, slug: 'hair',
    title:       'Hair Styling',
    tagline:     'Healthy hair, beautiful you.',
    description: 'Professional hair styling for all occasions — from everyday elegance to show-stopping bridal looks. We care for every texture and length.',
    image:       '/images/Caro-services/Hair-styling.jpg',
    icon:        <ScissorsIcon />,
    color:       '#00B6AD',
    features:    ['Bridal hairstyling', 'Evening & party looks', 'Hair extensions', 'Deep conditioning treatments', 'Professional consultations'],
    pricing: [
      { name: 'Box Braids',             price: 'GHS 250+' },
      { name: 'Cornrows',               price: 'GHS 150+' },
      { name: 'Weave Installation',     price: 'GHS 300+' },
      { name: 'Natural Hair Treatment', price: 'GHS 200+' },
    ],
    duration: '1 – 5 hrs',
  },
  {
    id: 2, slug: 'wigs',
    title:       'Wig Units',
    tagline:     'Custom-fitted, flawlessly styled.',
    description: 'Premium wig units and caps crafted to your exact specifications. From lace fronts to full 360 frontals — every unit is a masterpiece.',
    image:       '/images/Caps/cap8.jpg',
    icon:        <Layers />,
    color:       '#9c27b0',
    features:    ['Custom fittings & measurements', 'Premium lace & HD fronts', 'Natural-looking hairlines', '360 frontal installation', 'Post-install maintenance tips'],
    pricing: [
      { name: 'Lace Front Installation',  price: 'GHS 350+' },
      { name: 'Closure Installation',     price: 'GHS 300+' },
      { name: '360 Frontal Installation', price: 'GHS 400+' },
      { name: 'Custom Wig Styling',       price: 'GHS 250+' },
    ],
    duration: '2 – 4 hrs',
  },
  {
    id: 3, slug: 'makeup',
    title:       'Makeup Services',
    tagline:     'Flawless finish every time.',
    description: "Expert makeup application using premium, skin-safe products. Whether you're walking the aisle or the red carpet, we deliver stunning results.",
    image:       '/images/Caro-services/Makeup-services.jpg',
    icon:        <GlamourIcon />,
    color:       '#e91e8c',
    features:    ['Airbrush makeup', 'Full bridal packages', 'Editorial & photoshoot looks', 'Skincare prep & primer', 'Touch-up kits included'],
    pricing: [
      { name: 'Bridal Makeup',    price: 'GHS 400+' },
      { name: 'Evening Makeup',   price: 'GHS 300+' },
      { name: 'Editorial Makeup', price: 'GHS 500+' },
      { name: 'Basic Glam',       price: 'GHS 200+' },
    ],
    duration: '1 – 3 hrs',
  },
];

const STATS = [
  { icon: <PeopleIcon />,       value: '500+',  label: 'Happy Clients'         },
  { icon: <WorkspacePremium />, value: '5 Yrs', label: 'Years of Experience'   },
  { icon: <StarIcon />,         value: '100%',  label: 'Premium Products'      },
  { icon: <LocationOn />,       value: 'GH',    label: 'On-Location Available' },
];

const PROCESS = [
  { icon: <ChatIcon />,      title: 'Consultation', desc: 'We discuss your vision, skin type and preferred look — in person or virtually.' },
  { icon: <CalendarMonth />, title: 'Booking',      desc: 'Secure your appointment with a confirmed date, time and location of your choice.' },
  { icon: <SpaIcon />,       title: 'Service',      desc: 'Relax while our experts work their magic using only premium, skin-safe products.' },
  { icon: <ThumbUpIcon />,   title: 'Follow-up',    desc: 'We check in after your service to ensure you are completely satisfied.' },
];

const TESTIMONIALS = [
  { name: 'Abena K.',  service: 'Bridal Makeup',    quote: 'Pabett Beauty made my wedding day absolutely perfect. The team is so talented and professional — I felt like royalty!' },
  { name: 'Efua M.',   service: 'Hair Styling',     quote: 'Best braiding experience I have ever had. Clean, precise, and done in good time. I always come back!' },
  { name: 'Adwoa S.',  service: 'Wig Installation', quote: 'My lace front looked so natural, nobody could tell! The fitting was perfect and I felt so confident.' },
];

const FAQS = [
  { q: 'How far in advance should I book?',            a: 'We recommend booking at least 1–2 weeks ahead. For bridal services, 4–8 weeks is ideal to secure your preferred date.' },
  { q: 'Do you offer on-location services?',           a: 'Yes! Our mobile team can come to your home, hotel, or venue anywhere in Accra. A travel fee may apply depending on the location.' },
  { q: 'What happens if I need to reschedule?',        a: 'Please contact us at least 48 hours before your appointment to reschedule without any extra charge.' },
  { q: 'Are the products you use skin-safe?',          a: 'Absolutely. We use only premium, dermatologist-approved products and can accommodate sensitivities — just let us know when booking.' },
  { q: 'Do you offer group or bridal party packages?', a: 'Yes, we offer special group pricing for bridal parties, events, and corporate engagements. Contact us for a custom quote.' },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [services, setServices] = useState(SERVICES_FALLBACK);

  useEffect(() => {
    fetch(`${BASE_URL}/api/services`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length) setServices(data); })
      .catch(() => {});
  }, []);

  return (
    <Box>

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          height: { xs: '62vh', md: '72vh' },
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src="/images/Caro-services/Hair-styling.jpg"
          alt="Services Hero"
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 30%',
          }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(155deg, rgba(44,62,100,0.82) 0%, rgba(0,182,173,0.50) 100%)',
        }} />

        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', px: 3 }}>
          <motion.div initial={{ opacity: 0, y: -22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
            <Chip
              label="PABETT BEAUTY SERVICES"
              sx={{
                mb: 2.5, bgcolor: 'rgba(255,255,255,0.14)', color: '#fff',
                fontWeight: 700, letterSpacing: 2, backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 900, mb: 2, lineHeight: 1.06,
                textShadow: '0 2px 28px rgba(0,0,0,0.28)',
              }}
            >
              Our Premium Services
            </Typography>
            <Typography
              sx={{
                opacity: 0.88, maxWidth: 560, mx: 'auto',
                fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.72,
              }}
            >
              Professional beauty treatments crafted for your unique style — from everyday
              elegance to bridal perfection.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={4.5}>
              <Button
                href="/#booking-form"
                variant="contained" size="large"
                startIcon={<ScheduleIcon />}
                sx={{
                  bgcolor: PRIMARY, borderRadius: '999px', px: 4.5, py: 1.55,
                  fontWeight: 700, fontSize: '1rem',
                  boxShadow: '0 6px 24px rgba(0,182,173,0.45)',
                  '&:hover': { bgcolor: '#009688', transform: 'translateY(-2px)' },
                  transition: 'all 0.24s',
                }}
              >
                Book a Service
              </Button>
              <Button
                href="https://wa.me/233571901526"
                target="_blank" rel="noopener noreferrer"
                variant="outlined" size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: '#fff', borderColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '999px', px: 4.5, py: 1.55, fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
                }}
              >
                Chat with Us
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ── 2. Trust Stats Strip ────────────────────────────────────────── */}
      <Box sx={{ background: GRADIENT, py: { xs: 4, md: 4.5 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {STATS.map((s, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Stack alignItems="center" spacing={0.5}>
                    <Box sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', fontSize: 28 }}>{s.icon}</Box>
                    <Typography variant="h5" color="#fff" fontWeight={900} lineHeight={1}>{s.value}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.78)', fontWeight: 500, textAlign: 'center', letterSpacing: 0.4 }}>
                      {s.label}
                    </Typography>
                  </Stack>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── 3. Services — alternating image / content cards ─────────────── */}
      <Box sx={{ py: { xs: 8, md: 13 }, bgcolor: LIGHT_BG }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Chip label="WHAT WE OFFER" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5, letterSpacing: 1 }} />
            <Typography variant="h3" component="h2" fontWeight={900} color={DARK_TEXT} sx={{ fontSize: { xs: '2rem', md: '2.7rem' } }}>
              Our Beauty Services
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: PRIMARY, borderRadius: 2, mx: 'auto', mt: 2 }} />
          </Box>

          <Stack spacing={5}>
            {services.map((svc, i) => {
              const color    = svc.color || PRIMARY;
              const imgLeft  = i % 2 === 0;
              return (
                <motion.div
                  key={svc.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Paper
                    id={svc.slug}
                    elevation={0}
                    sx={{
                      borderRadius: 4, overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
                      scrollMarginTop: '80px',
                      '&:hover': { boxShadow: `0 14px 52px ${color}20` },
                      transition: 'box-shadow 0.35s ease',
                    }}
                  >
                    <Grid container sx={{ minHeight: { md: 350 } }}>

                      {/* Image panel */}
                      <Grid
                        item xs={12} md={5}
                        sx={{ order: { xs: 0, md: imgLeft ? 0 : 1 } }}
                      >
                        <Box sx={{ position: 'relative', height: { xs: 250, md: '100%' }, minHeight: { md: 340 } }}>
                          <Box
                            component="img"
                            src={svc.image}
                            alt={svc.title}
                            sx={{
                              position: 'absolute', inset: 0,
                              width: '100%', height: '100%', objectFit: 'cover',
                            }}
                          />
                          {/* Side-fade gradient toward the content */}
                          <Box sx={{
                            position: 'absolute', inset: 0,
                            background: `linear-gradient(${imgLeft ? 'to right' : 'to left'}, transparent 50%, ${color}45 100%)`,
                            display: { xs: 'none', md: 'block' },
                          }} />
                          {/* Bottom fade on mobile */}
                          <Box sx={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.45) 100%)',
                            display: { xs: 'block', md: 'none' },
                          }} />
                          {/* Duration badge */}
                          <Chip
                            label={`⏱ ${svc.duration || '1–3 hrs'}`}
                            size="small"
                            sx={{
                              position: 'absolute', top: 16, left: 16,
                              bgcolor: 'rgba(0,0,0,0.55)', color: '#fff',
                              backdropFilter: 'blur(6px)', fontWeight: 600,
                              border: '1px solid rgba(255,255,255,0.18)',
                            }}
                          />
                        </Box>
                      </Grid>

                      {/* Content panel */}
                      <Grid
                        item xs={12} md={7}
                        sx={{ order: { xs: 1, md: imgLeft ? 1 : 0 } }}
                      >
                        <Box
                          sx={{
                            p: { xs: 3, md: 5 }, height: '100%',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                          }}
                        >
                          {/* Title */}
                          <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                            <Box sx={{
                              bgcolor: `${color}15`, p: 1, borderRadius: 2,
                              color, display: 'flex', fontSize: 22,
                            }}>
                              {svc.icon || <SpaIcon />}
                            </Box>
                            <Box>
                              <Typography variant="h5" fontWeight={800} color={DARK_TEXT} lineHeight={1.2}>{svc.title}</Typography>
                              <Typography variant="body2" sx={{ color, fontWeight: 600, fontStyle: 'italic' }}>{svc.tagline}</Typography>
                            </Box>
                          </Stack>

                          <Divider sx={{ mb: 2, borderColor: `${color}20` }} />

                          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.82, fontSize: '0.97rem' }}>
                            {svc.description}
                          </Typography>

                          <Grid container spacing={2.5} mb={3.5}>
                            {/* Features */}
                            {svc.features && (
                              <Grid item xs={12} sm={6}>
                                <Typography variant="overline" fontWeight={700} color={color} sx={{ letterSpacing: 1.2 }}>
                                  What's Included
                                </Typography>
                                <List dense disablePadding sx={{ mt: 0.5 }}>
                                  {svc.features.slice(0, 5).map((f, fi) => (
                                    <ListItem key={fi} disableGutters sx={{ py: 0.3 }}>
                                      <ListItemIcon sx={{ minWidth: 24 }}>
                                        <CheckCircleOutline sx={{ fontSize: 15, color }} />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={f}
                                        primaryTypographyProps={{ fontSize: '0.88rem', color: DARK_TEXT }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Grid>
                            )}

                            {/* Pricing */}
                            {svc.pricing && (
                              <Grid item xs={12} sm={6}>
                                <Typography variant="overline" fontWeight={700} color={color} sx={{ letterSpacing: 1.2 }}>
                                  Starting Prices
                                </Typography>
                                <Stack spacing={0.7} mt={0.5}>
                                  {svc.pricing.map((p, pi) => (
                                    <Stack key={pi} direction="row" justifyContent="space-between" alignItems="center"
                                      sx={{ py: 0.55, borderBottom: '1px dashed rgba(0,0,0,0.07)' }}>
                                      <Typography variant="body2" color={DARK_TEXT} fontSize="0.85rem">{p.name}</Typography>
                                      <Chip
                                        label={p.price}
                                        size="small"
                                        sx={{ bgcolor: `${color}12`, color, fontWeight: 700, fontSize: '0.78rem', height: 22 }}
                                      />
                                    </Stack>
                                  ))}
                                </Stack>
                              </Grid>
                            )}
                          </Grid>

                          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                            <Button
                              href="/#booking-form"
                              variant="contained" size="medium"
                              endIcon={<ArrowForwardIcon />}
                              sx={{
                                bgcolor: color, borderRadius: '999px', px: 3.5, fontWeight: 700,
                                boxShadow: `0 4px 18px ${color}35`,
                                '&:hover': { filter: 'brightness(0.9)', transform: 'translateY(-1px)' },
                                transition: 'all 0.22s',
                              }}
                            >
                              Book Now
                            </Button>
                            <Button
                              href="https://wa.me/233571901526"
                              target="_blank" rel="noopener noreferrer"
                              variant="outlined" size="medium"
                              startIcon={<WhatsAppIcon />}
                              sx={{
                                borderRadius: '999px', px: 3,
                                color, borderColor: `${color}40`,
                                '&:hover': { bgcolor: `${color}08`, borderColor: color },
                              }}
                            >
                              Enquire
                            </Button>
                          </Stack>
                        </Box>
                      </Grid>

                    </Grid>
                  </Paper>
                </motion.div>
              );
            })}
          </Stack>
        </Container>
      </Box>

      {/* ── 4. How It Works ─────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 13 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Chip label="HOW IT WORKS" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5, letterSpacing: 1 }} />
            <Typography variant="h3" component="h2" fontWeight={900} color={DARK_TEXT} sx={{ fontSize: { xs: '2rem', md: '2.7rem' } }}>
              Our Professional Process
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="stretch">
            {PROCESS.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  style={{ height: '100%' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3.5, borderRadius: 4, textAlign: 'center', height: '100%',
                      border: '1px solid #eef2f7', position: 'relative',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: `0 8px 36px ${PRIMARY}18`,
                        transform: 'translateY(-5px)',
                        borderColor: `${PRIMARY}30`,
                      },
                    }}
                  >
                    {/* Step counter badge */}
                    <Box
                      sx={{
                        position: 'absolute', top: 16, right: 18,
                        width: 26, height: 26, borderRadius: '50%',
                        bgcolor: `${PRIMARY}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" fontWeight={800} color={PRIMARY}>{i + 1}</Typography>
                    </Box>
                    {/* Connector line between steps */}
                    {i < PROCESS.length - 1 && (
                      <Box sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute', top: 52, right: -16, zIndex: 1,
                        width: 32, height: 2,
                        background: `linear-gradient(90deg, ${PRIMARY}55, transparent)`,
                      }} />
                    )}
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 66, height: 66, borderRadius: '50%',
                        background: GRADIENT,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 28, mb: 2.5,
                        boxShadow: `0 6px 22px ${PRIMARY}35`,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} color={DARK_TEXT} gutterBottom>{step.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.78 }}>{step.desc}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── 5. Testimonials ─────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 13 },
          background: `linear-gradient(155deg, ${DARK_TEXT} 0%, #1a2a4a 100%)`,
          position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -70, right: -70, width: 320, height: 320, borderRadius: '50%', bgcolor: `${PRIMARY}12`, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -90, left: -90, width: 380, height: 380, borderRadius: '50%', bgcolor: `${PRIMARY}08`, pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={7}>
            <Chip label="CLIENT LOVE" sx={{ bgcolor: `${PRIMARY}28`, color: PRIMARY, fontWeight: 700, mb: 1.5, letterSpacing: 1 }} />
            <Typography variant="h3" component="h2" fontWeight={900} color="#fff" sx={{ fontSize: { xs: '2rem', md: '2.7rem' } }}>
              What Our Clients Say
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3.5, borderRadius: 4, height: '100%',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex', flexDirection: 'column',
                    }}
                  >
                    {/* Stars */}
                    <Stack direction="row" spacing={0.3} mb={2.5}>
                      {[...Array(5)].map((_, si) => (
                        <StarIcon key={si} sx={{ color: '#FFD700', fontSize: 18 }} />
                      ))}
                    </Stack>
                    <Typography
                      color="rgba(255,255,255,0.85)"
                      sx={{ lineHeight: 1.82, mb: 3, fontSize: '0.97rem', fontStyle: 'italic', flexGrow: 1 }}
                    >
                      "{t.quote}"
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ bgcolor: PRIMARY, width: 38, height: 38, fontSize: '0.9rem', fontWeight: 700 }}>
                        {t.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography color="#fff" fontWeight={700} fontSize="0.9rem">{t.name}</Typography>
                        <Typography variant="caption" color={PRIMARY} fontWeight={500}>{t.service}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── 6. FAQ ──────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: LIGHT_BG }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={7}>
            <Chip label="FAQ" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5, letterSpacing: 1 }} />
            <Typography variant="h3" component="h2" fontWeight={900} color={DARK_TEXT} sx={{ fontSize: { xs: '2rem', md: '2.7rem' } }}>
              Frequently Asked Questions
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {FAQS.map((faq, i) => (
              <Accordion
                key={i} disableGutters elevation={0}
                sx={{
                  borderRadius: '14px !important', border: '1px solid #e5eef0',
                  overflow: 'hidden', '&:before': { display: 'none' },
                  '&.Mui-expanded': { boxShadow: `0 6px 28px ${PRIMARY}18` },
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
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── 7. CTA Banner ───────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 9, md: 13 }, background: GRADIENT, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 420, height: 420, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, right: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <Typography
              variant="h3" color="#fff" fontWeight={900}
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
              mb={1.5}
            >
              Ready for Your Transformation?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.84)', mb: 5, maxWidth: 500, mx: 'auto', fontSize: '1.06rem', lineHeight: 1.72 }}>
              Book a consultation today and let our experts create your perfect look.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                href="/#booking-form"
                variant="contained" size="large"
                startIcon={<ScheduleIcon />}
                sx={{
                  bgcolor: '#fff', color: PRIMARY, borderRadius: '999px',
                  px: 5, py: 1.7, fontWeight: 800, fontSize: '1.05rem',
                  boxShadow: '0 6px 26px rgba(0,0,0,0.18)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.92)', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s',
                }}
              >
                Schedule Appointment
              </Button>
              <Button
                href="https://wa.me/233571901526"
                target="_blank" rel="noopener noreferrer"
                variant="outlined" size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: '#fff', borderColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '999px', px: 5, py: 1.7, fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
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
