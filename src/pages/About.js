import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Box, Typography, Button, Container, Grid, Card, Link,
  Stack, Chip, Paper, Avatar,
} from "@mui/material";
import { BASE_URL } from "../api/api";
import {
  LocationOn, Phone, Facebook, Instagram,
  WhatsApp as WhatsAppIcon,
  Favorite as HeartIcon,
  EmojiEvents as TrophyIcon,
  Groups as TeamIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";

// ─────────────────────────────────────────────────────────────────────────────
const PRIMARY   = "#00B6AD";
const DARK_TEXT = "#2C3E64";
const LIGHT_BG  = "#F7F9FB";
const GRADIENT  = "linear-gradient(135deg, #00B6AD 0%, #007B76 100%)";

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 30 },
  whileInView:{ opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
  viewport:   { once: true, amount: 0.25 },
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const VALUES = [
  { icon: <HeartIcon />,   title: "Passion",      desc: "We pour genuine love into every look we create, treating each client as our greatest canvas." },
  { icon: <TrophyIcon />,  title: "Excellence",   desc: "Only premium products and the highest standards of craft — no shortcuts, ever." },
  { icon: <SparkleIcon />, title: "Creativity",   desc: "Every client is unique. We bring fresh ideas and customized solutions to every appointment." },
  { icon: <TeamIcon />,    title: "Community",    desc: "We invest in local talent and are proud to serve and uplift the Accra beauty community." },
];

const MILESTONES_FALLBACK = [
  { year: "2016", event: "Pabett Beauty founded in Dansoman, Accra" },
  { year: "2018", event: "Launched our signature Hair Growth Oil" },
  { year: "2020", event: "Expanded to on-location bridal services" },
  { year: "2022", event: "500+ satisfied clients milestone" },
  { year: "2024", event: "Launched full wig customization studio" },
];

const TEAM_FALLBACK = [
  { _id: "t1", name: "Patricia Hemans", role: "Founder & Lead Stylist",  bio: "Certified makeup artist & hair specialist with 8+ years transforming Accra's most beautiful moments.", initials: "PH", color: PRIMARY },
  { _id: "t2", name: "Jessica",         role: "Senior Makeup Artist",     bio: "Bridal and editorial specialist known for flawless, long-wear finishes and skin-first techniques.",        initials: "JF", color: "#9c27b0" },
  { _id: "t3", name: "Euginia Okwabi",  role: "Wig Technician",           bio: "Expert in custom wig construction and lace installation. Every unit is a labour of love.",               initials: "EO", color: "#e91e8c" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function useApiData(url, fallback) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`${BASE_URL}${url}`)
      .then((r) => r.json())
      .then((d) => setData(Array.isArray(d) && d.length ? d : fallback))
      .catch(() => setData(fallback));
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps
  return data || fallback;
}

export default function About({
  title       = "About PABETT Beauty",
  description = "Meet the team behind PABETT Beauty — Accra's trusted destination for professional hair styling, makeup, and hair growth treatments.",
  url         = "https://pabettbeauty.com/about",
  image       = "https://yourdomain.com/images/og-image.jpg",
  phone       = "+233571901526",
  streetAddress   = "Your street here",
  addressLocality = "Accra",
  addressRegion   = "Dansoman",
  postalCode      = "23321",
  sameAs = [
    "https://www.facebook.com/pabett",
    "https://www.instagram.com/pabett",
  ],
}) {
  const milestones = useApiData('/api/milestones', MILESTONES_FALLBACK);
  const team       = useApiData('/api/team',       TEAM_FALLBACK);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "PABETT Beauty",
    image,
    "@id": url,
    url: "https://pabettbeauty.com",
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

  const getSocialIcon = (link) => {
    if (link.includes("facebook"))  return Facebook;
    if (link.includes("instagram")) return Instagram;
    return null;
  };

  const fullAddress = `${streetAddress}, ${addressLocality}, Ghana`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image"       content={image} />
        <meta property="og:url"         content={url} />
        <meta name="twitter:card"       content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Helmet>

      {/* ── Hero ── */}
      <Box
        sx={{
          minHeight: { xs: "52vh", md: "62vh" },
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #2C3E64 0%, #1a2a4a 100%)",
        }}
      >
        {/* Decorative shapes */}
        <Box sx={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", bgcolor: `${PRIMARY}15`, pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", bgcolor: `${PRIMARY}10`, pointerEvents: "none" }} />

        <Container sx={{ position: "relative", zIndex: 2, textAlign: "center", color: "#fff", py: 8, px: 3 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label="OUR STORY"
              sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, letterSpacing: 1.5, backdropFilter: "blur(4px)" }}
            />
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "2.4rem", sm: "3rem", md: "4rem" }, fontWeight: 800, mb: 2, lineHeight: 1.1 }}
            >
              About Pabett Beauty
            </Typography>
            <Typography
              sx={{ opacity: 0.8, maxWidth: 580, mx: "auto", fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.75 }}
            >
              Born in Accra. Built on passion. Dedicated to making every person who sits in our chair feel extraordinary.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* ── Our Story ── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div {...fadeUp(0)}>
                <Chip label="WHO WE ARE" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 2 }} />
             
                <Typography color="text.secondary" sx={{ lineHeight: 1.9, mb: 2 }}>
                  Founded in 2016 in the heart of Dansoman, Accra, Pabett Beauty started as a one-chair dream
                  and has grown into one of the most trusted beauty destinations in the city. Our founder,
                  Patricia Bettinson, believed that every person deserves to feel beautiful — regardless of occasion or budget.
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.9, mb: 3 }}>
                  Today, we offer a full suite of beauty services: bridal makeup, hair styling, wig customization,
                  and our bestselling Pabett Hair Growth Oil. Every service is delivered by certified professionals
                  who genuinely care about your outcome.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                  {[
                    { value: "8+",   label: "Years in Business" },
                    { value: "500+", label: "Happy Clients" },
                    { value: "3",    label: "Expert Stylists" },
                    { value: "99%",  label: "Satisfaction Rate" },
                  ].map((stat, i) => (
                    <Box key={i} textAlign="center" sx={{ minWidth: 80 }}>
                      <Typography fontWeight={800} color={PRIMARY} sx={{ fontSize: "1.7rem", lineHeight: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div {...fadeUp(0.15)}>
                <Box
                  sx={{
                    borderRadius: 4, overflow: "hidden",
                    boxShadow: "0 16px 56px rgba(0,182,173,0.15)",
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src="/images/Ceo.jpg"
                    alt="Pabett Beauty Team at work"
                    sx={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 480 }}
                  />
                  {/* floating badge */}
                  <Paper
                    sx={{
                      position: "absolute", bottom: 20, left: 20,
                      px: 2.5, py: 1.5, borderRadius: 3,
                      boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
                      display: "flex", alignItems: "center", gap: 1.5,
                    }}
                  >
                    <Box sx={{ fontSize: "1.8rem" }}>🏆</Box>
                    <Box>
                      <Typography fontWeight={700} color={DARK_TEXT} sx={{ lineHeight: 1.2 }}>Top-Rated</Typography>
                      <Typography variant="caption" color="text.secondary">Beauty Salon, Accra</Typography>
                    </Box>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Values ── */}
      <Box sx={{ py: { xs: 8, md: 11 }, bgcolor: LIGHT_BG }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="OUR VALUES" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={800} color={DARK_TEXT}>What Drives Us Every Day</Typography>
          </Box>
          <Grid container spacing={3}>
            {VALUES.map((v, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div {...fadeUp(i * 0.1)}>
                  <Paper
                    sx={{
                      p: 3.5, borderRadius: 4, height: "100%", textAlign: "center",
                      border: "1px solid #edf2f7",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: `0 12px 32px ${PRIMARY}15` },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: GRADIENT,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", mb: 2,
                        boxShadow: `0 4px 16px ${PRIMARY}35`,
                      }}
                    >
                      {v.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} color={DARK_TEXT} gutterBottom>{v.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>{v.desc}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Our Journey ── */}
      <Box sx={{ py: { xs: 8, md: 11 }, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Chip label="OUR JOURNEY" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={800} color={DARK_TEXT}>Milestones That Made Us</Typography>
          </Box>
          <Box sx={{ position: "relative" }}>
            {/* Timeline line */}
            <Box
              sx={{
                position: "absolute", left: { xs: 16, md: "50%" },
                top: 0, bottom: 0, width: 2, bgcolor: `${PRIMARY}25`,
                transform: { md: "translateX(-50%)" },
              }}
            />
            <Stack spacing={0}>
              {milestones.map((m, i) => (
                <motion.div key={i} {...fadeUp(i * 0.08)}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", md: i % 2 === 0 ? "row" : "row-reverse" },
                      alignItems: "center",
                      mb: 4,
                      pl: { xs: 5, md: 0 },
                    }}
                  >
                    {/* Dot */}
                    <Box
                      sx={{
                        position: { xs: "absolute", md: "relative" },
                        left: { xs: 8, md: "auto" },
                        width: 16, height: 16, borderRadius: "50%",
                        bgcolor: PRIMARY, border: "3px solid #fff",
                        boxShadow: `0 0 0 3px ${PRIMARY}40`,
                        flexShrink: 0,
                        mx: { md: 2 },
                        zIndex: 1,
                      }}
                    />
                    {/* Card */}
                    <Paper
                      sx={{
                        p: 2.5, borderRadius: 3, flex: 1,
                        maxWidth: { md: "42%" },
                        ml: { xs: 0, md: i % 2 === 0 ? 0 : "auto" },
                        mr: { md: i % 2 === 0 ? "auto" : 0 },
                        border: "1px solid #edf2f7",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, px: 1.2, py: 0.4, borderRadius: 1, fontWeight: 700 }}
                      >
                        {m.year}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color={DARK_TEXT} sx={{ mt: 1 }}>
                        {m.event}
                      </Typography>
                    </Paper>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ── Team ── */}
      <Box sx={{ py: { xs: 8, md: 11 }, bgcolor: LIGHT_BG }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="THE TEAM" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={800} color={DARK_TEXT}>The People Behind the Magic</Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 480, mx: "auto" }}>
              Meet the certified professionals who make every Pabett experience unforgettable.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, i) => (
              <Grid item xs={12} sm={6} md={4} key={member._id || i}>
                <motion.div {...fadeUp(i * 0.12)}>
                  <Paper
                    sx={{
                      p: 4, borderRadius: 4, textAlign: "center", height: "100%",
                      border: "1px solid #edf2f7",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: `0 12px 36px ${member.color}18` },
                    }}
                  >
                    <Avatar
                      src={member.image || undefined}
                      sx={{
                        width: 80, height: 80, mx: "auto", mb: 2,
                        background: `linear-gradient(135deg, ${member.color || PRIMARY} 0%, ${member.color || PRIMARY}88 100%)`,
                        fontSize: "1.4rem", fontWeight: 800, color: "#fff",
                        boxShadow: `0 4px 20px ${member.color || PRIMARY}35`,
                      }}
                    >
                      {!member.image && (member.initials || member.name?.slice(0, 2).toUpperCase())}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} color={DARK_TEXT}>{member.name}</Typography>
                    <Chip
                      label={member.role}
                      size="small"
                      sx={{ bgcolor: `${member.color}15`, color: member.color, fontWeight: 600, mt: 0.75, mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>{member.bio}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Contact Cards ── */}
      <Box sx={{ py: { xs: 8, md: 11 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="FIND US" sx={{ bgcolor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={800} color={DARK_TEXT}>Visit Us or Get in Touch</Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">

            {/* Location */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                component={motion.div}
                {...fadeUp(0.1)}
                sx={{
                  p: 3.5, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  height: "100%", display: "flex", flexDirection: "column",
                  border: "1px solid #edf2f7",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: `0 12px 36px ${PRIMARY}18` },
                }}
              >
                <Box sx={{ width: 52, height: 52, borderRadius: "50%", background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <LocationOn sx={{ color: "#fff" }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color={DARK_TEXT} mb={1}>Our Location</Typography>
                <Typography variant="body2" color="text.secondary">{streetAddress}</Typography>
                <Typography variant="body2" color="text.secondary">{addressLocality}, {addressRegion}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>{postalCode}</Typography>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: PRIMARY, fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  View on Google Maps →
                </Link>
              </Card>
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                component={motion.div}
                {...fadeUp(0.2)}
                sx={{
                  p: 3.5, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  height: "100%", display: "flex", flexDirection: "column",
                  border: "1px solid #edf2f7",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: `0 12px 36px ${PRIMARY}18` },
                }}
              >
                <Box sx={{ width: 52, height: 52, borderRadius: "50%", background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <Phone sx={{ color: "#fff" }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color={DARK_TEXT} mb={1}>Call or WhatsApp</Typography>
                <Link
                  href={`tel:${phone}`}
                  sx={{ textDecoration: "none", color: DARK_TEXT, fontWeight: 700, fontSize: "1.1rem" }}
                >
                  {phone}
                </Link>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>
                  Mon – Sat, 9:00 AM – 6:00 PM
                </Typography>
                <Button
                  href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    mt: 2.5, bgcolor: "#25D366", borderRadius: "999px", fontWeight: 700,
                    "&:hover": { bgcolor: "#1ebe59" },
                  }}
                >
                  Chat on WhatsApp
                </Button>
              </Card>
            </Grid>

            {/* Social */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                component={motion.div}
                {...fadeUp(0.3)}
                sx={{
                  p: 3.5, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  height: "100%", display: "flex", flexDirection: "column",
                  border: "1px solid #edf2f7",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: `0 12px 36px ${PRIMARY}18` },
                }}
              >
                <Box sx={{ width: 52, height: 52, borderRadius: "50%", background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <Facebook sx={{ color: "#fff" }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color={DARK_TEXT} mb={1}>Connect With Us</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.75 }}>
                  Follow our latest styles, tips, and behind-the-scenes content on social media.
                </Typography>
                <Stack direction="row" spacing={2} mt={2.5}>
                  {sameAs.map((link, index) => {
                    const Icon = getSocialIcon(link);
                    const platform = link.includes("facebook") ? "Facebook" : "Instagram";
                    const bg       = link.includes("facebook") ? "#1877f2" : "linear-gradient(135deg,#f58529,#dd2a7b,#8134af)";
                    if (!Icon) return null;
                    return (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit PABETT Beauty on ${platform}`}
                        sx={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            width: 46, height: 46, borderRadius: "50%",
                            background: bg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": { transform: "scale(1.12)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" },
                          }}
                        >
                          <Icon sx={{ fontSize: 22 }} />
                        </Box>
                      </Link>
                    );
                  })}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          background: "linear-gradient(135deg, #2C3E64 0%, #1a2a4a 100%)",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", bgcolor: `${PRIMARY}18`, pointerEvents: "none" }} />
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div {...fadeUp(0)}>
            <Typography variant="h4" color="#fff" fontWeight={800} mb={1.5} sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}>
              Ready to Experience Pabett?
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 4, fontSize: "1.05rem" }}>
              Book your appointment today and join hundreds of satisfied clients.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                href="/#booking-form"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: PRIMARY, borderRadius: "999px", px: 5, py: 1.5, fontWeight: 700,
                  boxShadow: "0 6px 24px rgba(0,182,173,0.4)",
                  "&:hover": { bgcolor: "#009688", transform: "translateY(-2px)" },
                  transition: "all 0.25s",
                }}
              >
                Book an Appointment
              </Button>
              <Button
                href="/services"
                variant="outlined"
                size="large"
                sx={{
                  color: "#fff", borderColor: "rgba(255,255,255,0.5)",
                  borderRadius: "999px", px: 5, py: 1.5, fontWeight: 600,
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                View Services
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}