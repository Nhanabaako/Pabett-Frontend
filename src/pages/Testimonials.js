import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Card, CardContent, Typography, Box, Avatar, Stack, CircularProgress } from '@mui/material';
import { BASE_URL } from '../api/api';

const FALLBACK = [
  { _id: 't1', author: 'Amelia K.',   role: 'Bride',            quote: 'Pabett transformed my wedding look — professional, calm, and the team was amazing.',      rating: 5 },
  { _id: 't2', author: 'Linda A.',    role: 'Client',           quote: 'Hair growth oil gave visible results in 6 weeks — great customer care too.',               rating: 5 },
  { _id: 't3', author: 'Rita N.',     role: 'Model',            quote: 'Makeup and styling were flawless — photos looked stunning.',                               rating: 5 },
  { _id: 't4', author: 'Sophia M.',   role: 'Event Host',       quote: 'Got compliments all night, makeup lasted perfectly under the lights.',                     rating: 5 },
  { _id: 't5', author: 'Grace O.',    role: 'Student',          quote: "My natural hair feels healthier and fuller thanks to Pabett's hair care.",                 rating: 5 },
  { _id: 't6', author: 'Clara J.',    role: 'Corporate Client', quote: 'Professional service, punctual, and results exceeded expectations.',                       rating: 4 },
  { _id: 't7', author: 'Naomi B.',    role: "Bride's Maid",     quote: 'The bridal party looked stunning and cohesive — amazing teamwork.',                       rating: 5 },
  { _id: 't8', author: 'Emily R.',    role: 'Entrepreneur',     quote: "Pabett's skincare tips improved my routine and boosted my confidence.",                   rating: 5 },
  { _id: 't9', author: 'Fiona C.',    role: 'Actress',          quote: 'Camera-ready makeup with attention to detail — highly recommended.',                      rating: 5 },
  { _id: 't10', author: 'Juliet S.', role: 'Mother of Bride',  quote: 'I felt beautiful and elegant — subtle yet radiant makeup style.',                         rating: 5 },
  { _id: 't11', author: 'Melissa D.',role: 'Influencer',        quote: 'Loved the flawless finish and product knowledge — worth every penny.',                    rating: 5 },
  { _id: 't12', author: 'Hannah P.', role: 'Bride',             quote: 'From trial to the big day, Pabett was supportive and made me shine.',                    rating: 5 },
];

export default function Testimonials({ slidesPerView = 1 }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/testimonials`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) && data.length ? data : FALLBACK))
      .catch(() => setItems(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#00B6AD' }} />
      </Box>
    );
  }

  return (
    <Box
      component="section"
      aria-labelledby="testimonials-heading"
      sx={{ my: 10, py: 6, background: 'linear-gradient(135deg, #f8f9fc, #ffffff)', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
    >
      <Typography id="testimonials-heading" variant="h4" sx={{ textAlign: 'center', mb: 6, fontWeight: 700, letterSpacing: '0.5px', color: '#2C3E64' }}>
        What Clients Say
      </Typography>

      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={slidesPerView}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        a11y={{ prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial' }}
      >
        {items.map((t) => (
          <SwiperSlide key={t._id}>
            <Card sx={{ maxWidth: 800, mx: 'auto', px: 4, py: 3, borderRadius: '20px', textAlign: 'center', background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 10px 28px rgba(0,0,0,0.15)' } }}>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.6, color: '#444' }}>
                  "{t.quote}"
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Avatar alt={t.author} src={t.image} sx={{ width: 56, height: 56 }} />
                  <Box textAlign="left">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2C3E64' }}>{t.author}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.5px' }}>
                      {t.role} •{' '}
                      <span style={{ color: '#FFD700', fontSize: '1.1rem' }}>{'★'.repeat(t.rating || 5)}</span>
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
