import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, List, ListItem, ListItemIcon, ListItemText, Button, Divider } from '@mui/material';
import { CheckCircleOutline, Settings, Star, Layers, PriceCheck } from '@mui/icons-material';

// --- Configuration & Data ---

const primaryColor = '#00B6AD';
const darkTextColor = '#2C3E64';
const lightBg = '#F7F9FB';

const services = [
  {
    id: 1,
    title: "Hair Styling",
    description: "Professional hair styling for all occasions including bridal, corporate, and special events.",
    image: "images/Caro-services/Hair-styling.jpg",
    icon: Settings,
    features: [
      "Bridal hairstyling",
      "Evening looks",
      "Hair extensions",
      "Professional consultations"
    ],
    pricingDetails: [
      "Box Braids - GHS 250+",
      "Cornrows - GHS 150+",
      "Weave Installation - GHS 300+",
      "Natural Hair Treatment - GHS 200+"
    ]
  },
  {
    id: 2,
    title: "Wig Units",
    description: "Custom wig units and caps tailored to your specific needs and preferences.",
    image: "images/Caps/cap8.jpg",
    icon: Layers,
    features: [
      "Custom fittings",
      "Premium materials",
      "Natural-looking results",
      "Maintenance guidance"
    ],
    pricingDetails: [
      "Lace Front Installation - GHS 350+",
      "Closure Installation - GHS 300+",
      "360 Frontal Installation - GHS 400+",
      "Custom Wig Styling - GHS 250+"
    ]
  },
  {
    id: 3,
    title: "Makeup Services",
    description: "Expert makeup application using high-quality products for flawless results.",
    image: "images/Caro-services/Makeup-services.jpg",
    icon: Star,
    features: [
      "Airbrush makeup",
      "Bridal packages",
      "Editorial looks",
      "Skincare prep"
    ],
    pricingDetails: [
      "Bridal Makeup - GHS 400+",
      "Evening Makeup - GHS 300+",
      "Editorial Makeup - GHS 500+",
      "Basic Makeup - GHS 200+"
    ]
  }
];

const processSteps = [
  { step: 1, title: "Consultation", description: "We discuss your vision and requirements" },
  { step: 2, title: "Booking", description: "Secure your appointment date and time" },
  { step: 3, title: "Service", description: "Enjoy your professional beauty treatment" },
  { step: 4, title: "Follow-up", description: "We ensure your complete satisfaction" }
];

// --- Animation Variants ---

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// --- Main Component ---

const ServicesPage = () => {
  return (
    <Box>
      {/* 👑 Hero Section */}
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
        <CardMedia 
          component="img" 
          image="images/Caro-services/Hair-styling.jpg"
          alt="Services Hero Background" 
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
        <Container sx={{ zIndex: 2, textAlign: 'center', color: 'white', p: 3 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, fontWeight: 700, mb: 1 }}>
              Our Premium Services
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.8 }}>
              Experience **luxury beauty treatments** tailored to your unique style
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* 💅 Services Grid */}
      <Container maxWidth="xl" sx={{ py: 8, bgcolor: lightBg }}>
        <Box textAlign="center" mb={6}>
          <motion.div initial="hidden" whileInView="show" variants={fadeInUp} viewport={{ once: true, amount: 0.2 }}>
            <Typography variant="h4" component="h2" sx={{ color: darkTextColor, fontWeight: 700, mb: 1 }}>
              Featured Beauty Services
            </Typography>
            <Box sx={{ width: 50, height: 3, bgcolor: primaryColor, mx: 'auto', mt: 2 }} />
          </motion.div>
        </Box>
        
        <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true, amount: 0.1 }}>
          <Grid container spacing={4}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <motion.div variants={fadeInUp}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      borderRadius: 3, 
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      display: 'flex', 
                      flexDirection: 'column',
                      '&:hover': { 
                        transform: 'translateY(-5px)', 
                        boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                        borderBottom: `4px solid ${primaryColor}`
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={service.image}
                            alt={service.title}
                            sx={{ 
                                objectFit: 'cover',
                                transition: 'transform 0.5s',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        />
                        {/* Professional Polish: Image Gradient Overlay */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '50%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))',
                            zIndex: 1
                        }} />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                position: 'absolute', bottom: 10, left: 15, 
                                color: 'white', fontWeight: 600, zIndex: 2 
                            }}
                        >
                            {service.title}
                        </Typography>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px', mb: 2 }}>
                        {service.description}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />

                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: darkTextColor, mt: 2, mb: 1 }}>
                          What's Included:
                      </Typography>

                      <List dense disablePadding>
                        {service.features.map((feature, index) => (
                          <ListItem key={index} disableGutters sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleOutline sx={{ fontSize: 16, color: primaryColor }} />
                            </ListItemIcon>
                            <ListItemText primary={feature} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
      
      {/* 💰 Detailed Pricing Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="show" variants={fadeInUp} viewport={{ once: true, amount: 0.2 }}>
            <Typography variant="h4" component="h2" textAlign="center" sx={{ fontWeight: 700, color: darkTextColor, mb: 1 }}>
              Transparent Service Pricing
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
              Find the perfect service and package to fit your needs and budget.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    borderTop: `6px solid ${primaryColor}`,
                  }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: primaryColor, mb: 2 }}>
                        {service.title}
                      </Typography>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <List disablePadding>
                        {service.pricingDetails.map((detail, i) => (
                          <ListItem key={i} disableGutters sx={{ py: 0.5, borderBottom: '1px dotted #eee' }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <PriceCheck sx={{ fontSize: 18, color: darkTextColor }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary={detail} 
                                primaryTypographyProps={{ fontSize: '1rem', color: darkTextColor }} 
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Box textAlign="center" mt={3}>
                           <Button variant="outlined" sx={{ color: primaryColor, borderColor: primaryColor, '&:hover': { bgcolor: lightBg } }}>
                               View Packages
                           </Button>
                       </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 🛠️ Process Section (Updated with Timeline/Flow Look) */}
      <Box sx={{ py: 8, bgcolor: lightBg }}>
        <Container maxWidth="lg">
            <Box textAlign="center" mb={6}>
                <motion.div initial="hidden" whileInView="show" variants={fadeInUp} viewport={{ once: true, amount: 0.2 }}>
                    <Typography variant="h4" component="h2" sx={{ color: darkTextColor, fontWeight: 700, mb: 1 }}>
                      Our Professional Process
                    </Typography>
                </motion.div>
            </Box>
            
            <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true, amount: 0.1 }}>
                <Grid container spacing={4} sx={{ position: 'relative' }}>
                    {/* Visual Connector Line (for desktop flow) */}
                    <Box sx={{ 
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        top: '55px', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        width: '80%', 
                        height: '2px', 
                        bgcolor: primaryColor, 
                        zIndex: 1,
                        opacity: 0.2 
                    }} />

                    {processSteps.map((step, index) => (
                        <Grid item xs={12} sm={6} md={3} key={step.step} sx={{ position: 'relative' }}>
                            <motion.div variants={fadeInUp}>
                                <Box textAlign="center" p={2} sx={{ 
                                    border: '1px solid #ddd', 
                                    borderRadius: '12px', 
                                    bgcolor: 'white', 
                                    height: '100%', 
                                    position: 'relative', 
                                    zIndex: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <Box 
                                        sx={{ 
                                            width: 50, 
                                            height: 50, 
                                            bgcolor: primaryColor, 
                                            borderRadius: '50%', 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            color: 'white', 
                                            fontWeight: 700, 
                                            fontSize: '1.2rem',
                                            mb: 2,
                                            mt: -5, // Lift the circle above the card
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {step.step}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: darkTextColor }} gutterBottom>{step.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Container>
      </Box>

      {/* 📞 CTA Section */}
      <Box sx={{ py: 8, bgcolor: darkTextColor }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="show" variants={fadeInUp} viewport={{ once: true, amount: 0.5 }}>
            <Typography variant="h4" component="h2" color="white" fontWeight={700} mb={2}>
              Ready for Your Transformation?
            </Typography>
            <Button
              variant="contained"
              size="large"
              // Ensure this links back to the booking section on the homepage or a dedicated booking form
              href="#booking" 
              sx={{
                bgcolor: primaryColor,
                color: 'white',
                px: 5,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: '#009688',
                },
              }}
            >
              Schedule Appointment
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;