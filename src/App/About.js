import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Box, Typography, Button, Container, Grid, Card, Link } from '@mui/material';
import { LocationOn, Phone, Facebook, Instagram } from '@mui/icons-material';

// --- Configuration & Data (MUI Theme Colors) ---
const primaryColor = '#00B6AD';
const darkTextColor = '#2C3E64';
const lightBg = '#F7F9FB';

// --- Animation Variants ---
const cardAnimation = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: delay },
    viewport: { once: true, amount: 0.3 }
});

export default function Address({
  title = "PABETT Beauty — Hair Styling, Makeup & Hair Growth | Accra",
  description = "Relax, rejuvenate and restore your beauty — professional hair styling, make-up and hair growth treatments in Accra.",
  url = "https://pabettbeauty.com",
  image = "https://yourdomain.com/images/og-image.jpg",
  phone = "+233571901526",
  streetAddress = "Your street here", 
  addressLocality = "Accra",
  addressRegion = "Dansoman",
  postalCode = "23321",
  sameAs = [
    "https://www.facebook.com/pabett",
    "https://www.instagram.com/pabett"
  ]
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "PABETT Beauty",
    image,
    "@id": url,
    url,
    telephone: phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry: "GH",
    },
    sameAs,
  };

  // Function to check if the card link is an external social media platform
  const getSocialIcon = (link) => {
    if (link.includes('facebook')) return Facebook;
    if (link.includes('instagram')) return Instagram;
    return null;
  };
  
  // Construct the full address string for the map link
  const fullAddress = `${streetAddress}, ${addressLocality}, Ghana`;

  return (
    <>
      {/* SEO Meta Tags - FIX: Using dangerouslySetInnerHTML */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script 
            type="application/ld+json" 
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} 
        />
      </Helmet>

      {/* Address Section */}
      <Box 
        sx={{ 
          bgcolor: lightBg, 
          py: 8, 
          textAlign: 'center' 
        }}
      >
        <Container maxWidth="lg">
          <motion.div {...cardAnimation(0)}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' }, 
                fontWeight: 'bold', 
                mb: 6, 
                color: darkTextColor 
              }}
            >
              Visit Us or Get in Touch
            </Typography>
          </motion.div>

          <Grid 
            container 
            spacing={4} 
            justifyContent="center"
            alignItems="stretch" 
          >
            {/* 📍 Location Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                component={motion.div} 
                {...cardAnimation(0.2)}
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  boxShadow: 3,
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: 'transform 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)', 
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.1)' 
                  }
                }}
              >
                <LocationOn sx={{ fontSize: 40, color: primaryColor, mb: 1.5 }} />
                <Typography variant="h5" sx={{ mb: 1, color: darkTextColor, fontWeight: 600 }}>
                  Our Location
                </Typography>
                <Typography variant="body1">{streetAddress}</Typography>
                <Typography variant="body1">{addressLocality}, {addressRegion}</Typography>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>{postalCode}</Typography>
                {/* FIX: Corrected map link to proper Google Maps query URL */}
                <Link 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      sx={{ mt: 2, display: 'block', color: primaryColor, fontWeight: 600 }}
                >
                    View on Map
                </Link>
              </Card>
            </Grid>

            {/* 📞 Phone Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                component={motion.div} 
                {...cardAnimation(0.4)}
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  boxShadow: 3,
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: 'transform 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)', 
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.1)' 
                  }
                }}
              >
                <Phone sx={{ fontSize: 40, color: primaryColor, mb: 1.5 }} />
                <Typography variant="h5" sx={{ mb: 1, color: darkTextColor, fontWeight: 600 }}>
                  Call Us
                </Typography>
                <Link href={`tel:${phone}`} 
                      variant="h6" 
                      sx={{ textDecoration: 'none', color: darkTextColor, fontWeight: 700 }}
                >
                    {phone}
                </Link>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>
                    Mon - Sat, 9:00 AM - 6:00 PM
                </Typography>
                <Button 
                    variant="outlined"
                    href="/contact" 
                    sx={{ mt: 3, color: primaryColor, borderColor: primaryColor, '&:hover': { bgcolor: primaryColor, color: 'white' } }}
                >
                    Book An Appointment
                </Button>
              </Card>
            </Grid>

            {/* 🔗 Social Links Card - FIX: Used Facebook component as placeholder */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                component={motion.div} 
                {...cardAnimation(0.6)}
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  boxShadow: 3,
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: 'transform 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)', 
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.1)' 
                  }
                }}
              >
                <Box sx={{ mb: 1.5 }}>
                  <Facebook sx={{ fontSize: 40, color: primaryColor }} /> 
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: darkTextColor, fontWeight: 600 }}>
                  Connect With Us
                </Typography>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  Follow our latest styles and behind-the-scenes content!
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                    {sameAs.map((link, index) => {
                        const Icon = getSocialIcon(link);
                        const platformName = link.includes('facebook') ? 'Facebook' : 'Instagram';
                        
                        if (!Icon) return null; 
                        
                        return (
                            <Link 
                                key={index}
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label={`Visit PABETT Beauty on ${platformName}`}
                                sx={{ color: darkTextColor, transition: 'color 0.3s ease', '&:hover': { color: primaryColor, transform: 'scale(1.1)' } }}
                            >
                                <Icon sx={{ fontSize: 40 }} />
                            </Link>
                        );
                    })}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}