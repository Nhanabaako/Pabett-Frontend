import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import {
  Box, Grid, Card, CardMedia, CardContent, Typography,
  Button, Container, Chip, Tab, Tabs, CircularProgress,
  Stack,
} from "@mui/material";
import ShoppingCartIcon  from "@mui/icons-material/ShoppingCart";
import StorefrontIcon    from "@mui/icons-material/Storefront";

// ── Must mirror backend VALID_CATEGORIES & ProductsAdmin PRODUCT_CATEGORIES ──
const CATEGORY_META = {
  hair_oil: {
    label:       "Hair Growth Oil",
    description: "Signature formulas to nourish and strengthen your hair.",
    color:       "#4caf50",
  },
  hair_care: {
    label:       "Hair Care",
    description: "Treatments and products for healthy, vibrant hair.",
    color:       "#2196f3",
  },
  skincare: {
    label:       "Skincare",
    description: "Premium skincare to reveal your natural radiance.",
    color:       "#e91e63",
  },
  accessories: {
    label:       "Accessories",
    description: "Curated accessories to complete every look.",
    color:       "#ff9800",
  },
  tools: {
    label:       "Styling Tools",
    description: "Professional tools for salon-quality results at home.",
    color:       "#9c27b0",
  },
  other: {
    label:       "Other",
    description: "More products from our collection.",
    color:       "#607d8b",
  },
};

const PRIMARY  = "#00B6AD";
const DARK_TEXT = "#2C3E64";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [groups,      setGroups]      = useState([]);   // [{ key, ...meta, items }]
  const [activeTab,   setActiveTab]   = useState(0);
  const [loading,     setLoading]     = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    apiFetch("/api/products")
      .then((data) => {
        setAllProducts(data);

        // Group by category in CATEGORY_META order
        const grouped = data.reduce((acc, p) => {
          const key = p.category || "other";
          if (!acc[key]) acc[key] = [];
          acc[key].push(p);
          return acc;
        }, {});

        const ordered = Object.keys(CATEGORY_META)
          .filter((key) => grouped[key]?.length > 0)
          .map((key) => ({
            key,
            ...CATEGORY_META[key],
            items: grouped[key],
          }));

        setGroups(ordered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeGroup = groups[activeTab];

  return (
    <Box sx={{ bgcolor: "#F7F9FB", minHeight: "100vh" }}>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          textAlign: "center",
          bgcolor: DARK_TEXT,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "radial-gradient(circle at 20% 50%, #00B6AD 0%, transparent 60%)",
          }}
        />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} mb={1}>
          <StorefrontIcon sx={{ fontSize: 34, color: PRIMARY }} />
          <Typography variant="h3" fontWeight={800}>
            Our Products
          </Typography>
        </Stack>
        <Typography sx={{ opacity: 0.7, maxWidth: 520, mx: "auto" }}>
          Premium beauty products — crafted for real results.
        </Typography>
        <Chip
          label={`${allProducts.length} items`}
          sx={{ mt: 2, bgcolor: PRIMARY, color: "#fff", fontWeight: 600 }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box textAlign="center" py={10}>
            <CircularProgress sx={{ color: PRIMARY }} />
          </Box>
        ) : groups.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={10}>
            No products available yet.
          </Typography>
        ) : (
          <>
            {/* ── Category Tabs ────────────────────────────────────── */}
            <Box sx={{ mb: 5, borderBottom: "2px solid #eee" }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { backgroundColor: PRIMARY, height: 3 } }}
                sx={{ minHeight: 52 }}
              >
                {groups.map((grp, idx) => (
                  <Tab
                    key={grp.key}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 8, height: 8, borderRadius: "50%",
                            bgcolor: grp.color, flexShrink: 0,
                          }}
                        />
                        <span>{grp.label}</span>
                        <Chip
                          label={grp.items.length}
                          size="small"
                          sx={{
                            height: 20, fontSize: "0.7rem",
                            bgcolor: activeTab === idx ? grp.color : "#eee",
                            color:   activeTab === idx ? "#fff" : "text.secondary",
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: activeTab === idx ? 700 : 500,
                      color: activeTab === idx ? DARK_TEXT : "text.secondary",
                      minHeight: 52,
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* ── Active Category ──────────────────────────────────── */}
            {activeGroup && (
              <>
                <Box mb={4}>
                  <motion.div
                    key={activeGroup.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Typography variant="h5" fontWeight={700} color={DARK_TEXT}>
                      {activeGroup.label}
                    </Typography>
                    <Box
                      sx={{
                        width: 40, height: 3,
                        bgcolor: activeGroup.color,
                        mt: 1, mb: 0.5,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {activeGroup.description}
                    </Typography>
                  </motion.div>
                </Box>

                <motion.div
                  key={`grid-${activeGroup.key}`}
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                >
                  <Grid container spacing={3}>
                    {activeGroup.items.map((p) => (
                      <Grid item xs={12} sm={6} md={4} key={p._id}>
                        <motion.div variants={itemVariants}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                              overflow: "hidden",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "transform 0.25s ease, box-shadow 0.25s ease",
                              "&:hover": {
                                transform: "translateY(-6px)",
                                boxShadow: "0 10px 28px rgba(0,0,0,0.13)",
                              },
                            }}
                          >
                            <Box sx={{ position: "relative", overflow: "hidden" }}>
                              <CardMedia
                                component="img"
                                height="260"
                                image={
                                  p.image.startsWith("http")
                                    ? p.image
                                    : `${
                                        process.env.NODE_ENV === "development"
                                          ? "http://localhost:5000"
                                          : process.env.REACT_APP_API_URL
                                      }${p.image}`
                                }
                                alt={p.name}
                                sx={{
                                  objectFit: "cover",
                                  transition: "transform 0.4s ease",
                                  "&:hover": { transform: "scale(1.05)" },
                                }}
                              />
                              <Chip
                                label={activeGroup.label}
                                size="small"
                                sx={{
                                  position: "absolute", top: 10, left: 10,
                                  bgcolor: activeGroup.color, color: "#fff",
                                  fontWeight: 600, fontSize: "0.68rem",
                                }}
                              />
                            </Box>

                            <CardContent
                              sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2.5 }}
                            >
                              <Typography
                                fontWeight={700}
                                fontSize="1rem"
                                color={DARK_TEXT}
                                noWrap
                                title={p.name}
                                mb={0.5}
                              >
                                {p.name}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ color: PRIMARY, fontWeight: 800, mb: "auto" }}
                              >
                                ₵{Number(p.price).toFixed(2)}
                              </Typography>

                              <Button
                                fullWidth
                                variant="contained"
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => addToCart(p)}
                                sx={{
                                  mt: 2,
                                  bgcolor: PRIMARY,
                                  borderRadius: "999px",
                                  fontWeight: 600,
                                  textTransform: "none",
                                  "&:hover": { bgcolor: "#009688" },
                                }}
                              >
                                Add to Cart
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}