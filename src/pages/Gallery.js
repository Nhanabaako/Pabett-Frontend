import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Typography, Button, Container, Grid,
  CardMedia, CircularProgress, Chip, Tab, Tabs,
} from '@mui/material';

const primaryColor  = '#00B6AD';
const darkTextColor = '#2C3E64';

// ── Must mirror backend VALID_SECTIONS & GalleryAdmin GALLERY_SECTIONS ──
const SECTION_META = {
  client: {
    label:       'Client Transformations',
    description: 'Witness the stunning results our clients achieve with our premium beauty services.',
    color:       '#00B6AD',
  },
  wig: {
    label:       'Wig Caps & Hairstyling Artistry',
    description: 'Explore our collection of premium, handcrafted wig units and expert styling work.',
    color:       '#9c27b0',
  },
  bridal: {
    label:       'Bridal Looks',
    description: 'Timeless, elegant bridal beauty — crafted for your most special day.',
    color:       '#e91e63',
  },
  makeup: {
    label:       'Makeup Artistry',
    description: 'Bold, flawless makeup for every occasion — from natural glam to editorial.',
    color:       '#ff5722',
  },
  behind_scenes: {
    label:       'Behind the Scenes',
    description: 'A peek into our studio — the creative process behind every look.',
    color:       '#607d8b',
  },
  other: {
    label:       'More Work',
    description: 'A selection of additional work from our portfolio.',
    color:       '#795548',
  },
};

export default function Gallery() {
  const navigate = useNavigate();

  const [sections,    setSections]    = useState([]);   // [{ key, ...meta, images }]
  const [activeTab,   setActiveTab]   = useState(0);    // tab index
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const handleScheduleClick = () =>
    navigate('/', { state: { scrollToBooking: true } });

  // ── Fetch & group ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const API =
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:5000/api/gallery'
            : `${process.env.REACT_APP_API_URL}/api/gallery`;

        const res = await fetch(API);
        if (!res.ok) throw new Error('Failed to fetch gallery images');
        const data = await res.json();

        // Group by section key
        const grouped = data.images.reduce((acc, img) => {
          const key = img.section || 'other';
          if (!acc[key]) acc[key] = [];
          acc[key].push(img);
          return acc;
        }, {});

        // Build ordered array using SECTION_META order
        const ordered = Object.keys(SECTION_META)
          .filter((key) => grouped[key]?.length > 0)
          .map((key) => ({
            key,
            ...SECTION_META[key],
            images: grouped[key],
          }));

        setSections(ordered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // ── Animation variants ─────────────────────────────────────────────
  const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  const imgUrl = (img) =>
    img.url.startsWith('http')
      ? img.url
      : `${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_API_URL}${img.url}`;

  const activeSection = sections[activeTab];

  return (
    <Box>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          height: '60vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', bgcolor: darkTextColor,
        }}
      >
        <Box
          component="img"
          src="images/caro-services/Caro2.jpg"
          alt="Gallery Hero Background"
          sx={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.45)', zIndex: 1,
          }}
        />
        <Box sx={{ zIndex: 2, textAlign: 'center', color: 'white', p: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2.6rem', md: '4.5rem' }, fontWeight: 700, mb: 1 }}
            >
              Beauty Gallery
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Typography variant="h5" sx={{ opacity: 0.8 }}>
              Where Art Meets Transformation
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress sx={{ color: primaryColor }} />
            <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading gallery…</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : sections.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 10 }}>
            No gallery images available yet.
          </Typography>
        ) : (
          <>
            {/* ── Section Tabs ─────────────────────────────────────── */}
            <Box sx={{ mb: 5, borderBottom: `2px solid #eee` }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { backgroundColor: primaryColor, height: 3 } }}
                sx={{ minHeight: 52 }}
              >
                {sections.map((sec, idx) => (
                  <Tab
                    key={sec.key}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 8, height: 8, borderRadius: '50%',
                            bgcolor: sec.color,
                            flexShrink: 0,
                          }}
                        />
                        <span>{sec.label}</span>
                        <Chip
                          label={sec.images.length}
                          size="small"
                          sx={{
                            height: 20, fontSize: '0.7rem',
                            bgcolor: activeTab === idx ? sec.color : '#eee',
                            color:   activeTab === idx ? '#fff' : 'text.secondary',
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      textTransform: 'none',
                      fontWeight: activeTab === idx ? 700 : 500,
                      color: activeTab === idx ? darkTextColor : 'text.secondary',
                      minHeight: 52,
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* ── Active Section ───────────────────────────────────── */}
            {activeSection && (
              <Box component="section">
                <Box textAlign="center" mb={5}>
                  <motion.div
                    key={activeSection.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: darkTextColor, fontWeight: 700, mb: 1 }}
                    >
                      {activeSection.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', maxWidth: 580, mx: 'auto' }}
                    >
                      {activeSection.description}
                    </Typography>
                    <Box
                      sx={{
                        width: 50, height: 3,
                        bgcolor: activeSection.color,
                        mx: 'auto', mt: 2,
                      }}
                    />
                  </motion.div>
                </Box>

                <motion.div
                  key={`grid-${activeSection.key}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  <Grid container spacing={3}>
                    {activeSection.images.map((img) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
                        <motion.div variants={itemVariants}>
                          <Box
                            sx={{
                              position: 'relative', overflow: 'hidden',
                              borderRadius: 2, boxShadow: 3,
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={imgUrl(img)}
                              alt={img.altText || activeSection.label}
                              loading="lazy"
                              sx={{
                                height: 300, objectFit: 'cover',
                                transition: 'transform 0.35s ease',
                                '&:hover': { transform: 'scale(1.06)' },
                              }}
                            />
                            {img.caption && (
                              <Box
                                sx={{
                                  position: 'absolute', bottom: 10, left: 10,
                                  bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                                  px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.82rem',
                                }}
                              >
                                {img.caption}
                              </Box>
                            )}
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#F7F9FB' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Typography variant="h4" sx={{ color: darkTextColor, fontWeight: 700, mb: 2 }}>
            Ready for Your Transformation?
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Book a consultation today and let us create your perfect look.
          </Typography>
          <Button
            onClick={handleScheduleClick}
            variant="contained"
            size="large"
            sx={{
              bgcolor: primaryColor, color: 'white',
              px: 5, py: 1.5, borderRadius: '50px',
              fontWeight: 600, fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              '&:hover': { bgcolor: '#009688', transform: 'scale(1.04)' },
              transition: 'all 0.25s ease',
            }}
          >
            Schedule Appointment
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}