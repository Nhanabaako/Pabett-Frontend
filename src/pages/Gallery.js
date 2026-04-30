import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Typography, Button, Container,
  Grid, CardMedia, CircularProgress, Chip,
  Dialog, IconButton,
} from '@mui/material';
import CloseIcon       from '@mui/icons-material/Close';
import ArrowBackIcon   from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ZoomInIcon      from '@mui/icons-material/ZoomIn';

const primaryColor  = '#00B6AD';
const darkTextColor = '#2C3E64';

const BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001'
    : process.env.REACT_APP_API_URL || 'https://pabett.onrender.com';

const resolveUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${BASE}${url}`;
};

// ── Must mirror GALLERY_SECTIONS in GalleryAdmin.js ─────────────────
const SECTION_META = {
  client:        { label: 'Client Transformations',     description: 'Witness the stunning results our clients achieve with our premium beauty services.' },
  wig:           { label: 'Wig & Hairstyling Artistry', description: 'Explore our collection of premium, handcrafted wig units and expert styling work.' },
  bridal:        { label: 'Bridal Looks',               description: 'Timeless bridal beauty — from romantic soft glam to bold editorial wedding looks.' },
  makeup:        { label: 'Makeup Artistry',            description: 'Editorial, event and everyday makeup looks crafted with precision and creativity.' },
  behind_scenes: { label: 'Behind the Scenes',          description: 'A glimpse into our studio process and the artistry behind every transformation.' },
  other:         { label: 'Gallery',                    description: 'More beautiful moments captured from our studio.' },
};

const SECTION_ORDER = ['client', 'bridal', 'wig', 'makeup', 'behind_scenes', 'other'];

export default function Gallery() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, img: null, images: [] });

  const openLightbox = (img, sectionImages) =>
    setLightbox({ open: true, img, images: sectionImages });

  const closeLightbox = useCallback(
    () => setLightbox((l) => ({ ...l, open: false })),
    []
  );

  const go = useCallback((dir) => {
    setLightbox((l) => {
      const idx  = l.images.findIndex((i) => i._id === l.img._id);
      const next = (idx + dir + l.images.length) % l.images.length;
      return { ...l, img: l.images[next] };
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open, go, closeLightbox]);

  const handleScheduleClick = () =>
    navigate('/', { state: { scrollToBooking: true } });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:5001/api/gallery'
            : `${process.env.REACT_APP_API_URL || 'https://pabett.onrender.com'}/api/gallery`
        );
        if (!res.ok) throw new Error('Failed to fetch gallery images');
        const data = await res.json();

        const grouped = {};
        (data.images || []).forEach((img) => {
          const key = img.section || 'other';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(img);
        });

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

  // Current index for the counter display
  const lightboxIndex = lightbox.img
    ? lightbox.images.findIndex((i) => i._id === lightbox.img._id)
    : 0;

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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', md: '4.5rem' }, fontWeight: 800, mb: 1 }}>
              Beauty Gallery
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
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
                bgcolor: primaryColor, color: '#fff',
                fontWeight: 600, fontSize: '0.8rem',
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
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                  <Typography variant="h4" component="h2" sx={{ color: darkTextColor, fontWeight: 800, mb: 1 }}>
                    {section.title}
                  </Typography>
                  {section.description && (
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                      {section.description}
                    </Typography>
                  )}
                  <Box sx={{ width: 50, height: 3, bgcolor: primaryColor, mx: 'auto', mt: 2, borderRadius: 2 }} />
                </motion.div>
              </Box>

              {/* Image Grid */}
              <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Grid container spacing={2.5}>
                  {section.images.map((img) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
                      <motion.div variants={itemVariants}>
                        <Box
                          onClick={() => openLightbox(img, section.images)}
                          sx={{
                            position: 'relative', overflow: 'hidden',
                            borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                            cursor: 'pointer',
                            '&:hover .overlay': { opacity: 1 },
                            '&:hover img': { transform: 'scale(1.06)' },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={resolveUrl(img.url)}
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
                              background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                            }}
                          >
                            <ZoomInIcon sx={{ color: '#fff', fontSize: 36, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
                            {img.caption && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#fff', fontWeight: 600, lineHeight: 1.3,
                                  px: 1.5, textAlign: 'center',
                                  position: 'absolute', bottom: 12, left: 0, right: 0,
                                }}
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

      {/* ── Lightbox Dialog ── */}
      <Dialog
        open={lightbox.open}
        onClose={closeLightbox}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            m: { xs: 1, sm: 2 },
            overflow: 'visible',
          },
        }}
        BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.92)' } }}
      >
        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: '#111' }}>
          {/* Close */}
          <IconButton
            onClick={closeLightbox}
            sx={{
              position: 'absolute', top: 10, right: 10, zIndex: 10,
              color: '#fff', bgcolor: 'rgba(255,255,255,0.12)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Prev */}
          {lightbox.images.length > 1 && (
            <IconButton
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              sx={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
                color: '#fff', bgcolor: 'rgba(255,255,255,0.12)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {/* Full image */}
          <Box
            component="img"
            src={resolveUrl(lightbox.img?.url)}
            alt={lightbox.img?.altText || 'Gallery Image'}
            sx={{
              width: '100%',
              maxHeight: '82vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />

          {/* Next */}
          {lightbox.images.length > 1 && (
            <IconButton
              onClick={(e) => { e.stopPropagation(); go(1); }}
              sx={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
                color: '#fff', bgcolor: 'rgba(255,255,255,0.12)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          )}

          {/* Bottom bar — caption + counter */}
          <Box
            sx={{
              bgcolor: 'rgba(0,0,0,0.75)',
              px: 3, py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 44,
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: '0.88rem', fontStyle: lightbox.img?.caption ? 'normal' : 'italic', opacity: lightbox.img?.caption ? 1 : 0.5 }}>
              {lightbox.img?.caption || SECTION_META[lightbox.img?.section]?.label || ''}
            </Typography>
            {lightbox.images.length > 1 && (
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', flexShrink: 0, ml: 2 }}>
                {lightboxIndex + 1} / {lightbox.images.length}
              </Typography>
            )}
          </Box>
        </Box>
      </Dialog>

      {/* ── Call to Action ── */}
      <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#F7F9FB' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Typography variant="h4" component="h2" sx={{ color: darkTextColor, fontWeight: 800, mb: 2 }}>
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
