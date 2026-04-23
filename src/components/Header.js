import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, IconButton, Box, Button,
  useMediaQuery, useTheme, Badge, Fab, Zoom,
  Drawer, List, ListItem, ListItemButton,
  ListItemText, ListItemIcon, Divider, Typography,
  Stack,
} from "@mui/material";
import ShoppingCartIcon       from "@mui/icons-material/ShoppingCart";
import MenuIcon               from "@mui/icons-material/Menu";
import CloseIcon              from "@mui/icons-material/Close";
import WhatsAppIcon           from "@mui/icons-material/WhatsApp";
import HomeIcon               from "@mui/icons-material/Home";
import CollectionsIcon        from "@mui/icons-material/Collections";
import StorefrontIcon         from "@mui/icons-material/Storefront";
import SpaIcon                from "@mui/icons-material/Spa";
import InfoIcon               from "@mui/icons-material/Info";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer  from "./CartDrawer";
import { useCart } from "../context/CartContext";

const THEME_COLORS = {
  primary:  "#00B6AD",
  darkText: "#2C3E64",
};

const navLinks = [
  { path: "/",        label: "Home",     icon: <HomeIcon fontSize="small" /> },
  { path: "/Gallery", label: "Gallery",  icon: <CollectionsIcon fontSize="small" /> },
  { path: "/Product", label: "Products", icon: <StorefrontIcon fontSize="small" /> },
  { path: "/Services",label: "Services", icon: <SpaIcon fontSize="small" /> },
  { path: "/About",   label: "About",    icon: <InfoIcon fontSize="small" /> },
];

export default function Header() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);

  const { cart } = useCart();
  const cartCount = cart?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <AppBar
        position="sticky"
        component={motion.div}
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        elevation={0}
        sx={{
          backgroundColor: scrolled
            ? "rgba(15, 25, 50, 0.96)"
            : "rgba(44, 62, 100, 0.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(0,182,173,0.18)"
            : "1px solid rgba(255,255,255,0.05)",
          transition: "all 0.35s ease",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            maxWidth: 1400,
            mx: "auto",
            width: "100%",
            minHeight: { xs: 60, md: 68 },
          }}
        >
          {/* ── Logo ── */}
          <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Box
                  component="img"
                  src="/images/pabet.png"
                  alt="Pabett Beauty"
                  onError={(e) => { e.target.style.display = "none"; }}
                  sx={{ height: { xs: 36, md: 44 }, width: "auto" }}
                />
                </Stack>
            </motion.div>
          </NavLink>

          {/* ── Desktop nav ── */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              {navLinks.map(({ path, label }) => {
                const active = isActive(path);
                return (
                  <Button
                    key={path}
                    component={NavLink}
                    to={path}
                    sx={{
                      color: active ? THEME_COLORS.primary : "rgba(255,255,255,0.85)",
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.88rem",
                      textTransform: "none",
                      px: 1.8,
                      py: 0.8,
                      borderRadius: 2,
                      position: "relative",
                      "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                      // Active underline
                      "&::after": active
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "60%",
                            height: 2,
                            borderRadius: 1,
                            bgcolor: THEME_COLORS.primary,
                          }
                        : {},
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* ── Right side actions ── */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}>
              <IconButton
                onClick={() => setCartOpen(true)}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.08)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                  borderRadius: 2,
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  color="error"
                  sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}
                >
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </IconButton>
            </motion.div>

            {!isMobile && (
              <>
                {/* WhatsApp CTA */}
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    component="a"
                    href="https://wa.me/233571901526"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<WhatsAppIcon />}
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "#25d366",
                      color: "#fff",
                      borderRadius: "999px",
                      fontWeight: 700,
                      textTransform: "none",
                      px: 2.2,
                      "&:hover": { bgcolor: "#1fb955" },
                      // Pulse glow
                      animation: "waGlow 2.4s ease-in-out infinite",
                      "@keyframes waGlow": {
                        "0%, 100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.5)" },
                        "50%":      { boxShadow: "0 0 0 8px rgba(37,211,102,0)" },
                      },
                    }}
                  >
                    WhatsApp
                  </Button>
                </motion.div>

                {/* Admin login */}
                <Button
                  onClick={() => navigate("/admin/login")}
                  startIcon={<AdminPanelSettingsIcon fontSize="small" />}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(255,255,255,0.25)",
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.5)" },
                  }}
                >
                  Admin
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ── Cart Drawer ── */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Mobile Side Drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: THEME_COLORS.darkText,
            color: "#fff",
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            px: 3, py: 2.5,
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              component="img"
              src="/images/pabet.png"
              alt="Pabett Beauty"
              onError={(e) => { e.target.style.display = "none"; }}
              sx={{ height: 32, width: "auto" }}
            />
            <Typography fontWeight={800} fontSize="1rem">
              PABETT
            </Typography>
          </Stack>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Nav links */}
        <List sx={{ px: 1, pt: 2 }}>
          <AnimatePresence>
            {navLinks.map(({ path, label, icon }, i) => {
              const active = isActive(path);
              return (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={NavLink}
                      to={path}
                      sx={{
                        borderRadius: 2,
                        bgcolor: active ? `${THEME_COLORS.primary}28` : "transparent",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: active ? THEME_COLORS.primary : "rgba(255,255,255,0.6)",
                          minWidth: 36,
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontWeight: active ? 700 : 500,
                          color: active ? THEME_COLORS.primary : "rgba(255,255,255,0.88)",
                          fontSize: "0.95rem",
                        }}
                      />
                      {active && (
                        <Box
                          sx={{
                            width: 5, height: 5, borderRadius: "50%",
                            bgcolor: THEME_COLORS.primary,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mx: 2 }} />

        {/* Bottom actions */}
        <Box sx={{ px: 2, py: 3 }}>
          <Button
            component="a"
            href="https://wa.me/233571901526"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#25d366", color: "#fff",
              borderRadius: "999px", fontWeight: 700,
              textTransform: "none", mb: 1.5,
              "&:hover": { bgcolor: "#1fb955" },
            }}
          >
            Chat on WhatsApp
          </Button>
          <Button
            onClick={() => { setDrawerOpen(false); navigate("/admin/login"); }}
            startIcon={<AdminPanelSettingsIcon fontSize="small" />}
            fullWidth
            variant="outlined"
            sx={{
              color: "rgba(255,255,255,0.7)",
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: "999px",
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            Admin Login
          </Button>
        </Box>
      </Drawer>

      {/* ── Floating WhatsApp (mobile only, outside viewport's nav area) ── */}
      <Zoom in={isMobile}>
        <Fab
          component="a"
          href="https://wa.me/233571901526"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          size="medium"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1300,
            bgcolor: "#25d366",
            color: "#fff",
            "&:hover": { bgcolor: "#1fb955" },
            boxShadow: "0 4px 16px rgba(37,211,102,0.5)",
            animation: "fabPulse 2.5s ease-in-out infinite",
            "@keyframes fabPulse": {
              "0%, 100%": { boxShadow: "0 4px 16px rgba(37,211,102,0.5)" },
              "50%":      { boxShadow: "0 4px 28px rgba(37,211,102,0.8)" },
            },
          }}
        >
          <WhatsAppIcon />
        </Fab>
      </Zoom>
    </>
  );
}