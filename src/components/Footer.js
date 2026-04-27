import React from "react";
import {
  Box, Grid, Typography, Link as MLink,
  IconButton, Divider, Stack, Chip,
} from "@mui/material";
import InstagramIcon   from "@mui/icons-material/Instagram";
import FacebookIcon    from "@mui/icons-material/Facebook";
import WhatsAppIcon    from "@mui/icons-material/WhatsApp";
import LocationOnIcon  from "@mui/icons-material/LocationOn";
import PhoneIcon       from "@mui/icons-material/Phone";
import EmailIcon       from "@mui/icons-material/Email";
import AccessTimeIcon  from "@mui/icons-material/AccessTime";
import { motion }      from "framer-motion";

const MotionBox     = motion(Box);
const MotionIconBtn = motion(IconButton);

const BRAND = {
  primary:  "#00B6AD",
  darkText: "#2C3E64",
  bg:       "#F0F4F8",
};

const socialVariants = {
  rest:  { scale: 1 },
  hover: { scale: 1.15, rotate: 5 },
};

export default function Footer({
  companyName = "",
  tagline     = "Elevating natural beauty with expert care.",
  services    = [
    "Hair Growth Treatment",
    "Bridal Hair Styling",
    "Wig-Cap Making",
    "Makeup & Hair Training",
    "Wig Installation",
    "Hair Styling & Treatments",
  ],
  contact = {
    phone:    "+233 57 190 1526",
    email:    "hello@pabettbeauty.com",
    location: "Dansoman, Accra, Ghana",
    hours:    "Mon – Sat: 9 AM – 6 PM",
    mapHref:  "https://www.google.com/maps/search/?api=1&query=Dansoman+Accra+Ghana",
  },
  quickLinks = [
    { label: "Home",     href: "/" },
    { label: "Gallery",  href: "/Gallery" },
    { label: "Products", href: "/Product" },
    { label: "Services", href: "/Services" },
    { label: "About",    href: "/About" },
    { label: "Book Now", href: "#booking-form" },
  ],
  socialLinks = {
    instagram: "https://instagram.com/",
    facebook:  "https://facebook.com/",
    whatsapp:  "https://wa.me/233571901526",
  },
}) {
  const year = new Date().getFullYear();

  // Smooth-scroll for anchor links
  const handleClick = (e, href) => {
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const colTitle = (text) => (
    <Typography
      variant="subtitle1"
      fontWeight={800}
      sx={{ color: BRAND.darkText, mb: 2, letterSpacing: 0.4 }}
    >
      {text}
    </Typography>
  );

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: 0.6,
    mb: 0.9,
    color: "text.secondary",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "color 0.18s, transform 0.18s",
    "&:hover": { color: BRAND.primary, transform: "translateX(4px)" },
  };

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{ bgcolor: BRAND.bg, borderTop: "1px solid #dde3ec" }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 6 }, pt: { xs: 6, md: 8 }, pb: 4 }}>
        <Grid container spacing={5}>

          {/* ── Brand column ── */}
          <Grid item xs={12} md={3.5}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              {/* Logo / name */}
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <Box
                  component="img"
                  src="/images/pabet.png"
                  alt={companyName}
                  onError={(e) => { e.target.style.display = "none"; }}
                  sx={{ height: 44, width: "auto" }}
                />
                <Typography variant="h6" fontWeight={800} color={BRAND.darkText}>
                  {companyName}
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" mb={2.5} maxWidth={280}>
                {tagline}
              </Typography>

              {/* Social icons */}
              <Stack direction="row" spacing={1}>
                {[
                  { href: socialLinks.instagram, icon: <InstagramIcon />, label: "Instagram", color: "#E1306C" },
                  { href: socialLinks.facebook,  icon: <FacebookIcon />,  label: "Facebook",  color: "#1877F2" },
                  { href: socialLinks.whatsapp,  icon: <WhatsAppIcon />,  label: "WhatsApp",  color: "#25D366" },
                ].map(({ href, icon, label, color }) => (
                  <MotionIconBtn
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    variants={socialVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.93 }}
                    sx={{
                      border: `1.5px solid ${color}30`,
                      bgcolor: `${color}10`,
                      color,
                      p: 1,
                      borderRadius: 2,
                      transition: "background 0.2s",
                      "&:hover": { bgcolor: `${color}22` },
                    }}
                  >
                    {React.cloneElement(icon, { fontSize: "small" })}
                  </MotionIconBtn>
                ))}
              </Stack>

              {/* Hours badge */}
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: "14px !important" }} />}
                label={contact.hours}
                size="small"
                sx={{
                  mt: 2.5, bgcolor: `${BRAND.primary}18`,
                  color: BRAND.darkText, fontWeight: 600,
                  fontSize: "0.72rem",
                }}
              />
            </MotionBox>
          </Grid>

          {/* ── Services column ── */}
          <Grid item xs={6} sm={4} md={2.5}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              {colTitle("Services")}
              {services.map((s) => (
                <MLink
                  key={s}
                  href={`/Services#${s.toLowerCase().replace(/\s+/g, "-")}`}
                  sx={linkStyle}
                >
                  <Box
                    component="span"
                    sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: BRAND.primary, flexShrink: 0 }}
                  />
                  {s}
                </MLink>
              ))}
            </MotionBox>
          </Grid>

          {/* ── Quick links column ── */}
          <Grid item xs={6} sm={4} md={2}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.14 }}
            >
              {colTitle("Quick Links")}
              {quickLinks.map((link) => (
                <MLink
                  key={link.label}
                  href={link.href}
                  sx={linkStyle}
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {link.label}
                </MLink>
              ))}
            </MotionBox>
          </Grid>

          {/* ── Contact column ── */}
          <Grid item xs={12} sm={4} md={4}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              {colTitle("Get In Touch")}

              {[
                {
                  icon: <PhoneIcon sx={{ fontSize: 16, color: BRAND.primary, flexShrink: 0 }} />,
                  content: (
                    <MLink href={`tel:${contact.phone}`} sx={{ color: "text.secondary", textDecoration: "none", fontSize: 14, "&:hover": { color: BRAND.primary } }}>
                      {contact.phone}
                    </MLink>
                  ),
                },
                {
                  icon: <EmailIcon sx={{ fontSize: 16, color: BRAND.primary, flexShrink: 0 }} />,
                  content: (
                    <MLink href={`mailto:${contact.email}`} sx={{ color: "text.secondary", textDecoration: "none", fontSize: 14, "&:hover": { color: BRAND.primary } }}>
                      {contact.email}
                    </MLink>
                  ),
                },
                {
                  icon: <LocationOnIcon sx={{ fontSize: 16, color: BRAND.primary, flexShrink: 0, mt: "2px" }} />,
                  content: (
                    <MLink href={contact.mapHref} target="_blank" rel="noopener noreferrer" sx={{ color: "text.secondary", textDecoration: "none", fontSize: 14, "&:hover": { color: BRAND.primary } }}>
                      {contact.location}
                    </MLink>
                  ),
                },
              ].map(({ icon, content }, i) => (
                <Stack key={i} direction="row" spacing={1.2} alignItems="flex-start" mb={1.5}>
                  {icon}
                  {content}
                </Stack>
              ))}

              {/* WhatsApp CTA */}
              <Box
                component="a"
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex", alignItems: "center", gap: 1,
                  mt: 2, px: 2.5, py: 1,
                  bgcolor: "#25D36618", border: "1.5px solid #25D36640",
                  borderRadius: "999px", textDecoration: "none",
                  color: "#1a9e4a", fontWeight: 700, fontSize: 13,
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#25D36628", transform: "translateY(-1px)" },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
                Chat on WhatsApp
              </Box>
            </MotionBox>
          </Grid>
        </Grid>

        {/* ── Divider + bottom bar ── */}
        <Divider sx={{ mt: 6, mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.disabled">
            © {year} {companyName}. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              sx={{
                width: 8, height: 8, borderRadius: "50%",
                bgcolor: BRAND.primary,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%":      { opacity: 0.4 },
                },
              }}
            />
            <Typography variant="caption" color="text.disabled">
              Designed with care in Accra, Ghana
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}