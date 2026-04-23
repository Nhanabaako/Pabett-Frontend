import React, { useEffect, useState } from "react";
import {
  Grid, Paper, Typography, Box, CircularProgress,
  Divider, Stack, Chip,
} from "@mui/material";
import InventoryIcon       from "@mui/icons-material/Inventory";
import CollectionsIcon     from "@mui/icons-material/Collections";
import EventAvailableIcon  from "@mui/icons-material/EventAvailable";
import CheckCircleIcon     from "@mui/icons-material/CheckCircle";
import PendingActionsIcon  from "@mui/icons-material/PendingActions";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Category / Section meta (mirrors admin pages) ───────────────────
const PRODUCT_CATEGORIES = [
  { value: "hair_oil",    label: "Hair Growth Oil", color: "#4caf50" },
  { value: "hair_care",   label: "Hair Care",       color: "#2196f3" },
  { value: "skincare",    label: "Skincare",         color: "#e91e63" },
  { value: "accessories", label: "Accessories",      color: "#ff9800" },
  { value: "tools",       label: "Styling Tools",    color: "#9c27b0" },
  { value: "other",       label: "Other",            color: "#607d8b" },
];

const GALLERY_SECTIONS = [
  { value: "client",        label: "Client Transformations", color: "#00B6AD" },
  { value: "wig",           label: "Wig & Hairstyling",      color: "#9c27b0" },
  { value: "bridal",        label: "Bridal",                 color: "#e91e63" },
  { value: "makeup",        label: "Makeup",                 color: "#ff5722" },
  { value: "behind_scenes", label: "Behind the Scenes",      color: "#607d8b" },
  { value: "other",         label: "Other",                  color: "#795548" },
];

// ── Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <Paper
      sx={{
        p: 3, borderRadius: 3,
        borderLeft: `5px solid ${color}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            bgcolor: `${color}18`, p: 1.5,
            borderRadius: 2, display: "flex",
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} color="#2C3E64">
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

// ── Breakdown Row ────────────────────────────────────────────────────
function BreakdownCard({ title, icon, color, rows, total }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: "100%", boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
        <Typography variant="h6" fontWeight={700} color="#2C3E64">
          {title}
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {rows.length === 0 ? (
        <Typography color="text.secondary" variant="body2">No data yet.</Typography>
      ) : (
        rows.map((row) => (
          <Stack
            key={row.key}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={1.2}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 10, height: 10, borderRadius: "50%",
                  bgcolor: row.color, flexShrink: 0,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {row.label}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={row.count}
                size="small"
                sx={{
                  bgcolor: row.color, color: "#fff",
                  fontWeight: 700, minWidth: 32,
                }}
              />
              {total > 0 && (
                <Typography variant="caption" color="text.disabled" sx={{ width: 36, textAlign: "right" }}>
                  {Math.round((row.count / total) * 100)}%
                </Typography>
              )}
            </Stack>
          </Stack>
        ))
      )}
    </Paper>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────
export default function Dashboard() {
  const [products,  setProducts]  = useState([]);
  const [images,    setImages]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  const adminKey = localStorage.getItem("adminKey");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { "x-admin-key": adminKey };

        const [prodRes, gallRes, bookRes] = await Promise.allSettled([
          fetch(`${BASE_URL}/api/products`),
          fetch(`${BASE_URL}/api/gallery`),
          fetch(`${BASE_URL}/api/bookings`, { headers }),
        ]);

        if (prodRes.status === "fulfilled" && prodRes.value.ok) {
          setProducts(await prodRes.value.json());
        }
        if (gallRes.status === "fulfilled" && gallRes.value.ok) {
          const data = await gallRes.value.json();
          setImages(data.images || []);
        }
        if (bookRes.status === "fulfilled" && bookRes.value.ok) {
          setBookings(await bookRes.value.json());
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [adminKey]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: "#00B6AD" }} />
      </Box>
    );
  }

  // Derived stats
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.confirmed
  ).length;
  const pendingBookings   = bookings.length - confirmedBookings;

  const productBreakdown = PRODUCT_CATEGORIES
    .map((c) => ({
      key:   c.value,
      label: c.label,
      color: c.color,
      count: products.filter((p) => (p.category || "other") === c.value).length,
    }))
    .filter((r) => r.count > 0);

  const galleryBreakdown = GALLERY_SECTIONS
    .map((s) => ({
      key:   s.value,
      label: s.label,
      color: s.color,
      count: images.filter((i) => (i.section || "other") === s.value).length,
    }))
    .filter((r) => r.count > 0);

  return (
    <Box>
      {/* ── Header ── */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} color="#2C3E64">
          📊 Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Live snapshot of your store and bookings
        </Typography>
      </Box>

      {/* ── Top Stat Cards ── */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<InventoryIcon />}
            label="Total Products"
            value={products.length}
            color="#00B6AD"
            sub={`${productBreakdown.length} categor${productBreakdown.length !== 1 ? "ies" : "y"}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CollectionsIcon />}
            label="Gallery Images"
            value={images.length}
            color="#9c27b0"
            sub={`${galleryBreakdown.length} section${galleryBreakdown.length !== 1 ? "s" : ""}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EventAvailableIcon />}
            label="Total Bookings"
            value={bookings.length}
            color="#2196f3"
            sub={`${confirmedBookings} confirmed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PendingActionsIcon />}
            label="Pending Bookings"
            value={pendingBookings}
            color="#ff9800"
            sub="awaiting confirmation"
          />
        </Grid>
      </Grid>

      {/* ── Breakdown Panels ── */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <BreakdownCard
            title="Products by Category"
            icon={<InventoryIcon />}
            color="#00B6AD"
            rows={productBreakdown}
            total={products.length}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <BreakdownCard
            title="Gallery by Section"
            icon={<CollectionsIcon />}
            color="#9c27b0"
            rows={galleryBreakdown}
            total={images.length}
          />
        </Grid>
      </Grid>

      {/* ── Recent Bookings ── */}
      {bookings.length > 0 && (
        <Box mt={5}>
          <Typography variant="h6" fontWeight={700} color="#2C3E64" mb={2}>
            🗓️ Recent Bookings
          </Typography>
          <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
            {bookings.slice(0, 5).map((b, i) => (
              <Box key={b._id || i}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ sm: "center" }}
                  justifyContent="space-between"
                  px={3} py={2}
                  spacing={1}
                >
                  <Box>
                    <Typography fontWeight={700} color="#2C3E64">
                      {b.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {b.service1}{b.service2 ? ` + ${b.service2}` : ""} · {b.date} at {b.time}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={b.appointmentType === "on-location" ? "On-Location" : "In-Studio"}
                      size="small"
                      sx={{
                        bgcolor: b.appointmentType === "on-location" ? "#ff9800" : "#4caf50",
                        color: "#fff", fontWeight: 600,
                      }}
                    />
                    {(b.status || b.confirmed) && (
                      <Chip
                        icon={b.status === "confirmed" || b.confirmed
                          ? <CheckCircleIcon fontSize="small" />
                          : <PendingActionsIcon fontSize="small" />
                        }
                        label={b.status === "confirmed" || b.confirmed ? "Confirmed" : "Pending"}
                        size="small"
                        sx={{
                          bgcolor: b.status === "confirmed" || b.confirmed ? "#e8f5e9" : "#fff3e0",
                          color:   b.status === "confirmed" || b.confirmed ? "#2e7d32"  : "#e65100",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
                {i < Math.min(bookings.length, 5) - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  );
}