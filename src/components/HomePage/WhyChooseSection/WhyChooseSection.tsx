import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const benefits = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Quick & Easy Booking',
    description: 'Book your perfect ride in minutes with our streamlined reservation process.',
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    title: 'Trusted Service',
    description: 'Join thousands of satisfied customers who trust us for their car rental needs.',
  },
  {
    icon: <LocalOfferIcon sx={{ fontSize: 40 }} />,
    title: 'Best Price Guarantee',
    description: 'We offer competitive rates and price matching to ensure you get the best deal.',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
    title: 'Award-Winning Service',
    description: 'Recognized for excellence in customer service and vehicle quality.',
  },
];

export default function WhyChooseSection() {
  return (
    <Box sx={{ py: { xs: 5, md: 12 }, bgcolor: '#1E90FF', color: 'white' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          sx={{ 
            mb: { xs: 4, md: 8 }, 
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.8rem' },
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: 40, md: 80 },
              height: 4,
              bgcolor: 'white',
              borderRadius: 2,
            },
          }}
        >
          Experience the DriveEase Difference
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 4 },
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      p: { xs: 1.2, md: 2 },
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {React.cloneElement(benefit.icon, { sx: { fontSize: { xs: 28, md: 40 } } })}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      opacity: 0.9,
                      lineHeight: 1.6,
                      fontSize: { xs: '0.97rem', md: '1rem' },
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 