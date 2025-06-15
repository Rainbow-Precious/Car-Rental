import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentsIcon from "@mui/icons-material/Payments";

const features = [
  {
    icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
    title: "Premium Fleet",
    description:
      "Choose from our extensive collection of well-maintained vehicles, from economy to luxury models.",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: "Secure Booking",
    description:
      "Enjoy peace of mind with our secure booking system and comprehensive insurance coverage.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: "24/7 Roadside",
    description:
      "Our dedicated support team is available round the clock for any assistance you need.",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80",
  },
  {
    icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
    title: "Flexible Plans",
    description:
      "Choose from daily, weekly, or monthly rental plans with transparent pricing and no hidden fees.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80",
  },
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: { xs: 5, md: 12 }, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: { xs: 4, md: 8 },
            fontWeight: 700,
            color: "#1E90FF",
            fontSize: { xs: "2rem", md: "2.8rem" },
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -12,
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: 40, md: 80 },
              height: 4,
              bgcolor: "#1E90FF",
              borderRadius: 2,
            },
          }}
        >
          Why Choose DriveEase
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height={200}
                  image={feature.image}
                  alt={feature.title}
                  sx={{
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Box
                    sx={{
                      color: "#1E90FF",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {feature.icon}
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color: "#1a1a1a",
                        fontSize: { xs: "1.1rem", md: "1.3rem" },
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: { xs: "0.97rem", md: "1rem" },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
