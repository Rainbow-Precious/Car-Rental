import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const quickLinks = [
  { title: 'Our Fleet', href: '/fleet' },
  { title: 'Rental Rates', href: '/rates' },
  { title: 'Locations', href: '/locations' },
  { title: 'Contact Us', href: '/contact' },
];

const supportLinks = [
  { title: 'FAQs', href: '/faqs' },
  { title: 'Terms & Conditions', href: '/terms' },
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Roadside Assistance', href: '/assistance' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a1a',
        color: 'white',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: { xs: 1.5, md: 2 },
                fontWeight: 700,
                color: '#1E90FF',
                fontSize: { xs: '1.3rem', md: '1.5rem' },
              }}
            >
              DriveEase Rentals
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: { xs: 2, md: 3 },
                opacity: 0.8,
                lineHeight: 1.6,
                fontSize: { xs: '0.97rem', md: '1rem' },
              }}
            >
              Your trusted partner for premium car rental services. Experience the freedom of the open road with our extensive fleet of well-maintained vehicles.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: { xs: 2, md: 0 } }}>
              <IconButton
                aria-label="Facebook"
                sx={{ color: 'white', '&:hover': { color: '#1E90FF' }, fontSize: { xs: 22, md: 24 } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{ color: 'white', '&:hover': { color: '#1E90FF' }, fontSize: { xs: 22, md: 24 } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{ color: 'white', '&:hover': { color: '#1E90FF' }, fontSize: { xs: 22, md: 24 } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                sx={{ color: 'white', '&:hover': { color: '#1E90FF' }, fontSize: { xs: 22, md: 24 } }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                mb: { xs: 1.5, md: 2 },
                fontWeight: 600,
                color: '#1E90FF',
                fontSize: { xs: '1.1rem', md: '1.2rem' },
              }}
            >
              Quick Links
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
            >
              {quickLinks.map((link) => (
                <Box
                  component="li"
                  key={link.title}
                  sx={{
                    mb: { xs: 0.7, md: 1 },
                  }}
                >
                  <Link
                    href={link.href}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      opacity: 0.8,
                      transition: 'opacity 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        color: '#1E90FF',
                      },
                      fontSize: { xs: '0.97rem', md: '1rem' },
                    }}
                  >
                    {link.title}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                mb: { xs: 1.5, md: 2 },
                fontWeight: 600,
                color: '#1E90FF',
                fontSize: { xs: '1.1rem', md: '1.2rem' },
              }}
            >
              Support
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
            >
              {supportLinks.map((link) => (
                <Box
                  component="li"
                  key={link.title}
                  sx={{
                    mb: { xs: 0.7, md: 1 },
                  }}
                >
                  <Link
                    href={link.href}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      opacity: 0.8,
                      transition: 'opacity 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        color: '#1E90FF',
                      },
                      fontSize: { xs: '0.97rem', md: '1rem' },
                    }}
                  >
                    {link.title}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: { xs: 3, md: 6 },
            pt: { xs: 2, md: 3 },
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.6,
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}
          >
            © {new Date().getFullYear()} DriveEase Rentals. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 