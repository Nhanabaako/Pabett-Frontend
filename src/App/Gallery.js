import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Container, Grid, CardMedia, CircularProgress } from '@mui/material';

const primaryColor = '#00B6AD';
const darkTextColor = '#2C3E64';

export default function Gallery() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleScheduleClick = () => {
    navigate('/', { state: { scrollToBooking: true } });
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/gallery'); // change to deployed API if needed
        if (!res.ok) throw new Error('Failed to fetch gallery images');
        const data = await res.json();

        // Group images by section field (assumes your backend has section field)
        const grouped = data.images.reduce((acc, img) => {
          const section = img.section || 'Other';
          if (!acc[section]) acc[section] = [];
          acc[section].push(img);
          return acc;
        }, {});

        // Transform into array with title, description, images
        const finalSections = Object.entries(grouped).map(([key, images]) => ({
          title: key === 'client' ? 'Client Transformations' :
                 key === 'wig' ? 'Wig Caps & Hairstyling Artistry' :
                 key,
          description: key === 'client'
            ? 'Witness the stunning results our clients achieve with our premium beauty services.'
            : key === 'wig'
            ? 'Explore our collection of premium, handcrafted wig units and expert styling work.'
            : '',
          images,
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

  const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <Box>
      {/* Hero Section */}
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
          alt="Gallery Hero Background"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.5)',
            zIndex: 1,
          }}
        />
        <Box sx={{ zIndex: 2, textAlign: 'center', color: 'white', p: 3 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, fontWeight: 700, mb: 1 }}>
              Beauty Gallery
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <Typography variant="h5" sx={{ opacity: 0.8 }}>
              Where Art Meets Transformation
            </Typography>
          </motion.div>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading gallery...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : sections.length === 0 ? (
          <Typography variant="body1" align="center">
            No gallery sections available.
          </Typography>
        ) : (
          sections.map((section, sectionIndex) => (
            <Box key={sectionIndex} component="section" mb={8}>
              <Box textAlign="center" mb={6}>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                  <Typography variant="h4" component="h2" sx={{ color: darkTextColor, fontWeight: 700, mb: 1 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                    {section.description}
                  </Typography>
                  <Box sx={{ width: 50, height: 3, bgcolor: primaryColor, mx: 'auto', mt: 2 }} />
                </motion.div>
              </Box>

              <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Grid container spacing={3}>
                  {section.images.map((img) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
                      <motion.div variants={itemVariants}>
                        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
                          <CardMedia
                            component="img"
                            image={img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`}
                            alt={img.altText || 'Gallery Image'}
                            loading="lazy"
                            sx={{
                              height: 300,
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': { transform: 'scale(1.05)' },
                            }}
                          />
                          {img.caption && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.85rem',
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
          ))
        )}
      </Container>

      {/* Call to Action */}
      <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#F7F9FB' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Typography variant="h4" component="h2" sx={{ color: darkTextColor, fontWeight: 700, mb: 2 }}>
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
              bgcolor: primaryColor,
              color: 'white',
              px: 5,
              py: 1.5,
              borderRadius: '50px',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: '#009688', transform: 'scale(1.05)' },
            }}
          >
            Schedule Appointment
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
