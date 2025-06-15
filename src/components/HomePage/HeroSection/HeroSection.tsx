import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import BookCarForm from "./BookCarForm";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80",
    headline: "Drive Your Dreams",
    description:
      "Experience the freedom of the open road with our premium fleet. From sleek sedans to powerful SUVs, find your perfect match for any journey.",
    features: [
      {
        icon: <DirectionsCarIcon sx={{ fontSize: 28 }} />,
        text: "200+ Premium Vehicles",
      },
      {
        icon: <LocationOnIcon sx={{ fontSize: 28 }} />,
        text: "50+ Locations Nationwide",
      },
      {
        icon: <CalendarTodayIcon sx={{ fontSize: 28 }} />,
        text: "Flexible Rental Periods",
      },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&q=80",
    headline: "Luxury & Comfort",
    description:
      "Travel in style and comfort with our top-of-the-line luxury vehicles, perfect for business or leisure.",
    features: [
      {
        icon: <DirectionsCarIcon sx={{ fontSize: 28 }} />,
        text: "Luxury Sedans & SUVs",
      },
      {
        icon: <LocationOnIcon sx={{ fontSize: 28 }} />,
        text: "Airport Pickup Available",
      },
      {
        icon: <CalendarTodayIcon sx={{ fontSize: 28 }} />,
        text: "Daily & Weekly Plans",
      },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&q=80",
    headline: "Adventure Awaits",
    description:
      "Hit the road for your next adventure with our reliable and spacious vehicles, ready for any destination.",
    features: [
      {
        icon: <DirectionsCarIcon sx={{ fontSize: 28 }} />,
        text: "SUVs & Crossovers",
      },
      {
        icon: <LocationOnIcon sx={{ fontSize: 28 }} />,
        text: "Nationwide Coverage",
      },
      {
        icon: <CalendarTodayIcon sx={{ fontSize: 28 }} />,
        text: "Unlimited Mileage Options",
      },
    ],
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 2500,
  pauseOnHover: true,
};

export default function HeroSection() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        position: "relative",
        bgcolor: "background.default",
        p: 0,
        m: 0,
      }}
    >
      <Slider {...sliderSettings}>
        {slides.map((slide, idx) => (
          <Box
            key={idx}
            sx={{
              width: "100%",
              minHeight: { xs: 400, md: 520 },
              height: { xs: "60vw", md: "70vh" },
              maxHeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
              backgroundImage: `linear-gradient(90deg, rgba(10,37,64,0.85) 0%, rgba(30,144,255,0.3) 70%, rgba(30,144,255,0.05) 100%), url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              px: { xs: 2, md: 12 },
              py: { xs: 8, md: 12 },
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ maxWidth: 600, zIndex: 2 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3.5rem" },
                  fontWeight: 800,
                  mb: 3,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {slide.headline}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
                }}
              >
                {slide.description}
              </Typography>
              <Stack spacing={2} sx={{ mb: 4 }}>
                {slide.features.map((feature, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    {feature.icon}
                    <Typography>{feature.text}</Typography>
                  </Box>
                ))}
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Button
                  onClick={handleOpen}
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "#1E90FF",
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    width: { xs: "100%", sm: "auto" },
                    mb: { xs: 1, sm: 0 },
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Rent Your Ride
                </Button>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <BookCarForm onClose={handleClose} />
      </Dialog>
    </Box>
  );
}
