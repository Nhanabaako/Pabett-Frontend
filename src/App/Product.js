import React from "react";
import { motion } from 'framer-motion';
import { ShoppingCart } from '@mui/icons-material';
import { Box, Typography, Button, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';

// --- Configuration & Data ---

const primaryColor = '#00B6AD';
const darkTextColor = '#2C3E64';

const productsData = [
  {
    category: "Pabett Hair Growth Oil",
    items: [
      {
        id: 1,
        name: "Pabett oil Hair growth oil",
        price: "Ghc 150.00",
        image: "images/Pabett oil Flier.png",
        description: "Hydrate, strengthen, and grow. Our flagship oil promotes rapid growth and restores scalp health.",
        link: "https://wa.me/233571901526"
      }
    ]
  },
  {
    category: "Premium Wig Caps & Units",
    items: [
      {
        id: 2,
        name: "Curly Deep Wave Wig",
        price: "Ghc 750.00",
        image: "images/Caps/Cap1.jpg", // Placeholder image path
        description: "Handcrafted wig unit for a voluminous, deep wave look. Easy to wear and style.",
        link: "https://wa.me/233571901526"
      },
      {
        id: 3,
        name: "Straight Bob Cap",
        price: "Ghc 580.00",
        image: "images/Caps/Cap2.jpg", // Placeholder image path
        description: "Sleek and classic straight bob unit. Perfect for everyday elegance.",
        link: "https://wa.me/233571901526"
      }
    ]
  },
  {
    category: "Luxury Human Hair Bundles",
    items: [
      {
        id: 4,
        name: "Brazilian Straight 16\"",
        price: "Ghc 420.00",
        image: "images/human-hair/hair1.jpg", // Placeholder image path
        description: "100% Virgin Human Hair. Tangle-free and lustrous for a natural flow.",
        link: "https://wa.me/233571901526"
      },
      {
        id: 5,
        name: "Peruvian Body Wave 18\"",
        price: "Ghc 510.00",
        image: "images/human-hair/hair2.jpg", // Placeholder image path
        description: "Soft, bouncy Peruvian body wave for effortless volume and movement.",
        link: "https://wa.me/233571901526"
      }
    ]
  },
  {
    category: "Signature Perfumes",
    items: [
      {
        id: 6,
        name: "Vanilla Dream Eau De Parfum",
        price: "Ghc 180.00",
        image: "images/perfumes/perfume1.jpg", // Placeholder image path
        description: "A warm blend of Madagascar vanilla and soft musk. Long-lasting scent.",
        link: "https://wa.me/233571901526"
      },
      {
        id: 7,
        name: "Ocean Breeze Fragrance",
        price: "Ghc 150.00",
        image: "images/perfumes/perfume2.jpg", // Placeholder image path
        description: "Fresh, aquatic notes with a hint of citrus. Perfect for daytime wear.",
        link: "https://wa.me/233571901526"
      }
    ]
  }
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
      staggerChildren: 0.15,
    },
  },
};

// --- Main Component ---

export default function Product() {
  return (
    <Box sx={{ minHeight: '100vh', py: 8, bgcolor: '#F7F9FB' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div initial="hidden" whileInView="show" variants={fadeInUp} viewport={{ once: true }}>
          <Typography 
            variant="h3" 
            component="h1" 
            textAlign="center" 
            mb={2} 
            sx={{ color: darkTextColor, fontWeight: 700 }}
          >
            Pabett Exclusive Product Store
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            mb={8} 
            sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}
          >
            Explore our curated selection of hair growth solutions, luxury units, and signature fragrances.
          </Typography>
        </motion.div>

        {/* Product Sections */}
        {productsData.map((section, sectionIndex) => (
          <Box key={section.category} component="section" mb={8}>
            {/* Section Title */}
            <motion.div initial="hidden" whileInView="show" variants={fadeInUp} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.1 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ color: darkTextColor, fontWeight: 700, mb: 4, borderBottom: `3px solid ${primaryColor}`, display: 'inline-block', pb: 0.5 }}
              >
                {section.category}
              </Typography>
            </motion.div>
            
            {/* Product Grid */}
            <motion.div initial="hidden" whileInView="show" variants={staggerContainer} viewport={{ once: true, amount: 0.1 }}>
              <Grid container spacing={4}>
                {section.items.map((product, productIndex) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <motion.div variants={fadeInUp}>
                      <Card 
                        sx={{ 
                          borderRadius: 3, 
                          boxShadow: '0 10px 20px rgba(0,0,0,0.05)', 
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="250"
                          image={product.image}
                          alt={product.name}
                          loading="lazy"
                          sx={{ objectFit: 'cover', p: section.category.includes('Oil') ? 2 : 0 }} // Padding for the oil bottle
                        />
                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={600} color={darkTextColor} sx={{ minHeight: '48px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {product.name}
                          </Typography>
                          <Typography variant="h6" color={primaryColor} fontWeight={700} my={1}>
                            {product.price}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '36px' }}>
                            {product.description.substring(0, 60)}...
                          </Typography>
                          
                          <Button
                            variant="contained"
                            size="medium"
                            startIcon={<ShoppingCart />}
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              bgcolor: primaryColor,
                              color: 'white',
                              borderRadius: 2,
                              fontWeight: 600,
                              '&:hover': { bgcolor: '#009688' },
                            }}
                          >
                            Order Now
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Box>
        ))}

      </Container>
    </Box>
  );
}