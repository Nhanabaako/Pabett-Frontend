// Paste this into your footer component file (e.g. src/components/MUI_BeautyFooter.jsx)

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link as MLink,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

/**
 * MUI Beauty Footer Component — styled to match homepage palette
 * - Blends with homepage (brand colors: #2C3E64, #00B6AD, #25D366, #F7F9FB)
 * - Smooth in-page booking anchor (#Bookingforms)
 * - Accessible, responsive, animated
 */

const MotionIconButton = motion(IconButton);

export default function MUIBeautyFooter({
  companyName = "PABETT Beauty",
  about =
    "We offer professional beauty and wellness services focused on hair growth, hydration, and holistic care.",
  services = [
    "Hair Growth Treatment",
    "Bridal Hair Styling",
    "Wig-cap Making ",
    "Make-up & Hair Training ",
  ],
  contact = {
    phone: "+233571901526",
    email: "hello@pabettbeauty.com",
    location: "Accra, Ghana",
    mapHref: "https://www.google.com/maps",
  },
  quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Book", href: "#Bookingforms" }, // anchor to your form
    { label: "Contact", href: "/contact" },
  ],
  socialLinks = {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    whatsapp: "https://wa.me/233571901526",
  },
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const year = new Date().getFullYear();


  const brand = {
    primary: "#2C3E64",
    accent: "#00B6AD",
    accentBright: "#25D366",
    bg: "#F7F9FB",
  };

  const sectionTitleSx = {
    fontWeight: 700,
    mb: 1,
    color: brand.primary,
  };

  const linkSx = {
    display: "block",
    mb: 0.6,
    color: theme.palette.text.primary,
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 14,
    transition: "color 160ms, transform 120ms",
    "&:hover": { color: brand.accent, transform: "translateX(4px)" },
  };

  const iconSx = {
    borderRadius: 1,
    border: `1px solid ${theme.palette.divider}`,
    p: 0.9,
    color: brand.primary,
    background: "transparent",
    transition: "background 180ms, transform 120ms",
    "&:hover": { background: `${brand.accent}22` }, // subtle teal tint on hover
  };

  const rootSx = {
    background: brand.bg,
    borderTop: `1px solid ${theme.palette.divider}`,
    pt: { xs: 4, sm: 6 },
    pb: { xs: 4, sm: 6 },
  };

  const handleLinkClick = (e, href) => {
    if (!href) return;
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const prefersReduced =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        try {
          el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        } catch (err) {}
        try {
          window.history.pushState(null, "", href);
        } catch (err) {}
      }
    }
  };

  return (
    <Box component="footer" role="contentinfo" sx={rootSx}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} sm={6} md={3}>
            <Box component="section" aria-labelledby="footer-about">
              <Typography id="footer-about" variant="h6" sx={sectionTitleSx}>
                {companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                {about}
              </Typography>

              <Box sx={{ mt: 2, display: "flex", gap: 1 }} aria-label="Social media links">
                <MotionIconButton
                  component="a"
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  sx={iconSx}
                >
                  <InstagramIcon fontSize={isSm ? "medium" : "small"} />
                </MotionIconButton>

                <MotionIconButton
                  component="a"
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  sx={iconSx}
                >
                  <FacebookIcon fontSize={isSm ? "medium" : "small"} />
                </MotionIconButton>

                <MotionIconButton
                  component="a"
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{ ...iconSx, bgcolor: `${brand.accent}10`, color: brand.primary }}
                >
                  <WhatsAppIcon fontSize={isSm ? "medium" : "small"} />
                </MotionIconButton>
              </Box>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Box component="nav" aria-labelledby="footer-services">
              <Typography id="footer-services" variant="subtitle1" sx={sectionTitleSx}>
                Services
              </Typography>
              {services.map((s, idx) => (
                <MLink
                  key={idx}
                  href={`/services#${s.toLowerCase().replace(/\s+/g, "-")}`}
                  sx={linkSx}
                  aria-label={`Service ${s}`}
                >
                  {s}
                </MLink>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Box component="nav" aria-labelledby="footer-links">
              <Typography id="footer-links" variant="subtitle1" sx={sectionTitleSx}>
                Quick Links
              </Typography>
              {quickLinks.map((link, i) => (
                <MLink
                  key={i}
                  href={link.href}
                  sx={linkSx}
                  aria-label={`Navigate to ${link.label}`}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </MLink>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Box component="address" aria-labelledby="footer-contact" sx={{ fontStyle: "normal" }}>
              <Typography id="footer-contact" variant="subtitle1" sx={sectionTitleSx}>
                Contact
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.6 }}>
                <strong>Phone: </strong>
                <MLink
                  href={`tel:${contact.phone}`}
                  sx={{ color: brand.primary, textDecoration: "none" }}
                  aria-label={`Call ${contact.phone}`}
                >
                  {contact.phone}
                </MLink>
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.6 }}>
                <strong>Email: </strong>
                <MLink
                  href={`mailto:${contact.email}`}
                  sx={{ color: brand.primary, textDecoration: "none" }}
                  aria-label={`Email ${contact.email}`}
                >
                  {contact.email}
                </MLink>
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.6 }}>
                <strong>Location: </strong>
                <MLink
                  href={contact.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: brand.primary, textDecoration: "none" }}
                  aria-label={`Open map for ${contact.location}`}
                >
                  {contact.location}
                </MLink>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {year} {companyName}. All rights reserved.
          </Typography>

          <Typography variant="caption" sx={{ color: "text.secondary" }} component="p" aria-hidden>
            Designed with care • Accessibility minded
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// memo for minor perf gains
export const Footer = React.memo(MUIBeautyFooter);
