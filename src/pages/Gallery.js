import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Typography, Button, Container,
  Grid, CardMedia, CircularProgress, Chip,
} from '@mui/material';

const primaryColor  = '#00B6AD';
const darkTextColor = '#2C3E64';

// ── Must mirror GALLERY_SECTIONS in GalleryAdmin.js ─────────────────
const SECTION_META = {
  client:        { label: 'Client Transformations',  description: 'Witness the stunning results our clients achieve with our premium beauty services.' },
  wig:           { label: 'Wig & Hairstyling Artistry', description: 'Explore our collection of premium, handcrafted wig units and expert styling work.' },
  bridal:        { label: 'Bridal Looks',            description: 'Timeless bridal beauty — from romantic soft glam to bold editorial wedding looks.' },
  makeup:        { label: 'Makeup Artistry',         description: 'Editorial, event and everyday makeup looks crafted with precision and creativity.' },
  behind_scenes: { label: 'Behind the Scenes',       description: 'A glimpse into our studio process and the artistry behind every transformation.' },
  other:         { label: 'Gallery',                 description: 'More beautiful moments captured from our studio.' },
};

// Section order for display
const SECTION_ORDER = ['client', 'bridal', 'wig', 'makeup', 'behind_scenes', 'other'];

export default function Gallery() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const handleScheduleClick = () => {
    navigate('/', { state: { scrollToBooking: true } });
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:5000/api/gallery'
            : `${process.env.REACT_APP_API_URL}/api/gallery`
        );
        if (!res.ok) throw new Error('Failed to fetch gallery images');
        const data = await res.json();

        // Group images by section
        const grouped = {};
        (data.images || []).forEach((img) => {
          const key = img.section || 'other';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(img);
        });

        // Build ordered sections array, skip empty ones
        const finalSections = SECTION_ORDER
          .filter((key) => grouped[key]?.length > 0)
          .map((key) => ({
            key,
            title:       SECTION_META[key]?.label       || key,
            description: SECTION_META[key]?.description || '',
            images:      grouped[key],
          }));

        setSections(finalSections);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const staggerContainer = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  return (
    <Box>
      {/* ── Hero ── */}
      <Box
        sx={{
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: darkTextColor,
        }}
      >
        <Box
          component="img"
          src="images/caro-services/Caro2.jpg"
          alt="Gallery Hero"
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
              sx={{ fontSize: { xs: '2.8rem', md: '4.5rem' }, fontWeight: 800, mb: 1 }}
            >
              Beauty Gallery
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Typography variant="h5" sx={{ opacity: 0.85 }}>
              Where Art Meets Transformation
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* ── Section Navigation Pills ── */}
      {!loading && !error && sections.length > 0 && (
        <Box
          sx={{
            py: 3, px: 2,
            display: 'flex', gap: 1.5, flexWrap: 'wrap',
            justifyContent: 'center',
            bgcolor: '#fff',
            borderBottom: '1px solid #eee',
            position: 'sticky', top: 0, zIndex: 10,
          }}
        >
          {sections.map((sec) => (
            <Chip
              key={sec.key}
              label={sec.title}
              component="a"
              href={`#section-${sec.key}`}
              clickable
              size="medium"
              sx={{
                bgcolor: primaryColor,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.8rem',
                '&:hover': { bgcolor: '#009688' },
              }}
            />
          ))}
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress sx={{ color: primaryColor }} />
            <Typography sx={{ mt: 2 }}>Loading gallery…</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : sections.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 8, color: 'text.secondary' }}>
            No gallery images available yet.
          </Typography>
        ) : (
          sections.map((section) => (
            <Box
              key={section.key}
              id={`section-${section.key}`}
              component="section"
              mb={10}
              sx={{ scrollMarginTop: '80px' }}
            >
              {/* Section Header */}
              <Box textAlign="center" mb={5}>
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ color: darkTextColor, fontWeight: 800, mb: 1 }}
                  >
                    {section.title}
                  </Typography>
                  {section.description && (
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
                    >
                      {section.description}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      width: 50, height: 3,
                      bgcolor: primaryColor,
                      mx: 'auto', mt: 2, borderRadius: 2,
                    }}
                  />
                </motion.div>
              </Box>

              {/* Image Grid */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Grid container spacing={2.5}>
                  {section.images.map((img) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
                      <motion.div variants={itemVariants}>
                        <Box
                          sx={{
                            position: 'relative', overflow: 'hidden',
                            borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                            '&:hover .overlay': { opacity: 1 },
                            '&:hover img': { transform: 'scale(1.06)' },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={
                              img.url.startsWith('http')
                                ? img.url
                                : `${process.env.NODE_ENV === 'development'
                                    ? 'http://localhost:5000'
                                    : process.env.REACT_APP_API_URL}${img.url}`
                            }
                            alt={img.altText || 'Gallery Image'}
                            loading="lazy"
                            sx={{
                              height: 280,
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease',
                            }}
                          />
                          {/* Hover overlay */}
                          <Box
                            className="overlay"
                            sx={{
                              position: 'absolute', inset: 0,
                              background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              display: 'flex', alignItems: 'flex-end', p: 1.5,
                            }}
                          >
                            {img.caption && (
                              <Typography
                                variant="caption"
                                sx={{ color: '#fff', fontWeight: 600, lineHeight: 1.3 }}
                              >
                                {img.caption}
                              </Typography>
                            )}
                          </Box>

                          {/* Section badge */}
                          <Chip
                            label={SECTION_META[img.section]?.label || img.section}
                            size="small"
                            sx={{
                              position: 'absolute', top: 8, left: 8,
                              bgcolor: 'rgba(0,182,173,0.88)',
                              color: '#fff', fontWeight: 700, fontSize: '0.65rem',
                            }}
                          />
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Box>
          ))
        )}
      </Container>

      {/* ── Call to Action ── */}
      <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#F7F9FB' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ color: darkTextColor, fontWeight: 800, mb: 2 }}
          >
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
              fontWeight: 700, fontSize: '1.05rem',
              boxShadow: '0 4px 18px rgba(0,182,173,0.35)',
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