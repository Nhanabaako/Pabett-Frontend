// src/pages/Product.js  (public-facing products page)
import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useCart } from "../context/CartContext";
import {
  Box, Grid, Card, CardMedia, CardContent,
  Typography, Button, Container, Chip,
  CircularProgress, Stack, Collapse, IconButton,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ExpandMoreIcon           from "@mui/icons-material/ExpandMore";
import ExpandLessIcon           from "@mui/icons-material/ExpandLess";

// ── Must mirror PRODUCT_CATEGORIES in ProductsAdmin.js ──────────────
const CATEGORY_META = {
  hair_oil:    { label: "Hair Growth Oil",                   color: "#4caf50" },
  hair_care:   { label: "Hair Care",                         color: "#2196f3" },
  hair_sales:  { label: "Hair Sales (Wigs, Weaves & Curls)", color: "#00B6AD" },
  skincare:    { label: "Skincare Products",                 color: "#e91e63" },
  makeup:      { label: "Hair & Makeup Products",            color: "#ff5722" },
  accessories: { label: "Accessories",                       color: "#ff9800" },
  tools:       { label: "Styling Tools",                     color: "#9c27b0" },
  other:       { label: "Other",                             color: "#607d8b" },
};

const CATEGORY_ORDER = [
  "hair_oil", "hair_care", "hair_sales",
  "skincare", "makeup", "accessories", "tools", "other",
];

const primaryColor  = "#00B6AD";
const darkTextColor = "#2C3E64";

export default function Products() {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const { addToCart } = useCart();

  useEffect(() => {
    apiFetch("/api/products")
      .then((data) => { setProducts(data); setLoading(false); })
      .catch((err)  => { console.error(err); setLoading(false); });
  }, []);

  const grouped = CATEGORY_ORDER.reduce((acc, key) => {
    const items = products.filter((p) => (p.category || "other") === key);
    if (items.length > 0) acc[key] = items;
    return acc;
  }, {});

  const availableCategories = CATEGORY_ORDER.filter((k) => grouped[k]);

  const displayProducts =
    activeCat === "all"
      ? products
      : products.filter((p) => (p.category || "other") === activeCat);

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress sx={{ color: primaryColor }} />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#F7F9FB", minHeight: "100vh" }}>
      {/* ── Page Header ── */}
      <Box
        sx={{
          py: 6, textAlign: "center",
          background: `linear-gradient(135deg, ${darkTextColor} 0%, #3a5080 100%)`,
          color: "#fff",
        }}
      >
        <Typography variant="h3" fontWeight={800} mb={1}>
          Our Products
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 520, mx: "auto" }}>
          Premium beauty products carefully selected for every hair type and skin tone.
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* ── Category Filter Pills ── */}
        {availableCategories.length > 1 && (
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center", mb: 5 }}>
            <Chip
              label={`All (${products.length})`}
              onClick={() => setActiveCat("all")}
              sx={{
                fontWeight: 700, fontSize: "0.82rem",
                bgcolor: activeCat === "all" ? darkTextColor : "transparent",
                color:   activeCat === "all" ? "#fff" : "text.secondary",
                border:  `2px solid ${darkTextColor}`,
                "&:hover": { bgcolor: darkTextColor, color: "#fff" },
              }}
            />
            {availableCategories.map((key) => {
              const meta = CATEGORY_META[key];
              return (
                <Chip
                  key={key}
                  label={`${meta.label} (${grouped[key].length})`}
                  onClick={() => setActiveCat(key)}
                  sx={{
                    fontWeight: 600, fontSize: "0.82rem",
                    bgcolor: activeCat === key ? meta.color : "transparent",
                    color:   activeCat === key ? "#fff" : "text.secondary",
                    border:  `2px solid ${meta.color}`,
                    "&:hover": { bgcolor: meta.color, color: "#fff" },
                  }}
                />
              );
            })}
          </Box>
        )}

        {/* ── Render by section (all) or flat grid (filtered) ── */}
        {activeCat === "all" ? (
          availableCategories.map((key) => {
            const meta = CATEGORY_META[key];
            return (
              <Box key={key} mb={8}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Box sx={{ width: 5, height: 32, borderRadius: 2, bgcolor: meta.color }} />
                  <Typography variant="h5" fontWeight={800} sx={{ color: darkTextColor }}>
                    {meta.label}
                  </Typography>
                  <Chip
                    label={`${grouped[key].length} item${grouped[key].length !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{ bgcolor: meta.color, color: "#fff", fontWeight: 600 }}
                  />
                </Stack>
                <Grid container spacing={3}>
                  {grouped[key].map((p) => (
                    <ProductCard key={p._id} product={p} meta={meta} addToCart={addToCart} />
                  ))}
                </Grid>
              </Box>
            );
          })
        ) : (
          <Grid container spacing={3}>
            {displayProducts.map((p) => {
              const meta = CATEGORY_META[p.category || "other"];
              return <ProductCard key={p._id} product={p} meta={meta} addToCart={addToCart} />;
            })}
          </Grid>
        )}

        {products.length === 0 && (
          <Box textAlign="center" py={10}>
            <Typography color="text.secondary" variant="h6">
              No products available yet.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// ── Product Card ─────────────────────────────────────────────────────
function ProductCard({ product: p, meta, addToCart }) {
  const [descOpen, setDescOpen] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          borderRadius: 3, height: "100%",
          display: "flex", flexDirection: "column",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
          },
        }}
      >
        {/* ✅ Image — Cloudinary URL is already absolute, no prefix needed */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="240"
            image={p.image}
            alt={p.name}
            sx={{ objectFit: "cover" }}
          />
          <Chip
            label={meta.label}
            size="small"
            sx={{
              position: "absolute", top: 10, left: 10,
              bgcolor: meta.color, color: "#fff",
              fontWeight: 700, fontSize: "0.68rem",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.5, p: 2 }}>
          <Typography
            fontWeight={700}
            sx={{ color: "#2C3E64", fontSize: "0.95rem" }}
            noWrap title={p.name}
          >
            {p.name}
          </Typography>

          <Typography variant="h6" sx={{ color: "#00B6AD", fontWeight: 800 }}>
            ₵{Number(p.price).toFixed(2)}
          </Typography>

          {/* ✅ Expandable description */}
          {p.description && (
            <Box>
              <Collapse in={descOpen} collapsedSize={40}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.5, display: "block" }}
                >
                  {p.description}
                </Typography>
              </Collapse>
              <IconButton
                size="small"
                onClick={() => setDescOpen((v) => !v)}
                sx={{ p: 0, mt: 0.5, color: "text.secondary" }}
              >
                {descOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                <Typography variant="caption" sx={{ ml: 0.25 }}>
                  {descOpen ? "Less" : "More info"}
                </Typography>
              </IconButton>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartOutlinedIcon />}
            onClick={() => addToCart(p)}
            sx={{
              mt: "auto",
              pt: 1,
              bgcolor: "#00B6AD",
              borderRadius: "999px",
              fontWeight: 700,
              "&:hover": { bgcolor: "#009688" },
            }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}