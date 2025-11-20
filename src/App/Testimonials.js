// src/components/Testimonials.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Card, CardContent, Typography, Box, Avatar, Stack } from "@mui/material";

const testimonials = [
  {
    id: "t1",
    name: "Amelia K.",
    role: "Bride",
    text: "Pabett transformed my wedding look — professional, calm, and the team was amazing.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "t2",
    name: "Linda A.",
    role: "Client",
    text: "Hair growth oil gave visible results in 6 weeks — great customer care too.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "t3",
    name: "Rita N.",
    role: "Model",
    text: "Makeup and styling were flawless — photos looked stunning.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/35.jpg",
  },
  {
    id: "t4",
    name: "Sophia M.",
    role: "Event Host",
    text: "Got compliments all night, makeup lasted perfectly under the lights.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/46.jpg",
  },
  {
    id: "t5",
    name: "Grace O.",
    role: "Student",
    text: "My natural hair feels healthier and fuller thanks to Pabett’s hair care.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: "t6",
    name: "Clara J.",
    role: "Corporate Client",
    text: "Professional service, punctual, and results exceeded expectations.",
    rating: 4,
    // image: "https://randomuser.me/api/portraits/women/77.jpg",
  },
  {
    id: "t7",
    name: "Naomi B.",
    role: "Bride’s Maid",
    text: "The bridal party looked stunning and cohesive — amazing teamwork.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/82.jpg",
  },
  {
    id: "t8",
    name: "Emily R.",
    role: "Entrepreneur",
    text: "Pabett’s skincare tips improved my routine and boosted my confidence.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/31.jpg",
  },
  {
    id: "t9",
    name: "Fiona C.",
    role: "Actress",
    text: "Camera-ready makeup with attention to detail — highly recommended.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/60.jpg",
  },
  {
    id: "t10",
    name: "Juliet S.",
    role: "Mother of Bride",
    text: "I felt beautiful and elegant — subtle yet radiant makeup style.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/84.jpg",
  },
  {
    id: "t11",
    name: "Melissa D.",
    role: "Influencer",
    text: "Loved the flawless finish and product knowledge — worth every penny.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    id: "t12",
    name: "Hannah P.",
    role: "Bride",
    text: "From trial to the big day, Pabett was supportive and made me shine.",
    rating: 5,
    // image: "https://randomuser.me/api/portraits/women/41.jpg",
  },
];

export default function Testimonials({ slidesPerView = 1 }) {
  return (
    <Box
      component="section"
      aria-labelledby="testimonials-heading"
      sx={{
        my: 10,
        py: 6,
        background: "linear-gradient(135deg, #f8f9fc, #ffffff)",
        borderRadius: "24px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        id="testimonials-heading"
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 6,
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: "#2C3E64",
        }}
      >
        What Clients Say
      </Typography>

      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={slidesPerView}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        a11y={{ prevSlideMessage: "Previous testimonial", nextSlideMessage: "Next testimonial" }}
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <Card
              sx={{
                maxWidth: 800,
                mx: "auto",
                px: 4,
                py: 3,
                borderRadius: "20px",
                textAlign: "center",
                background: "#fff",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    color: "#444",
                  }}
                >
                  "{t.text}"
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Avatar alt={t.name} src={t.image} sx={{ width: 56, height: 56 }} />
                  <Box textAlign="left">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2C3E64" }}>
                      {t.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: "0.5px" }}>
                      {t.role} •{" "}
                      <span style={{ color: "#FFD700", fontSize: "1.1rem" }}>
                        {Array.from({ length: t.rating }).map((_, i) => "★").join("")}
                      </span>
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
