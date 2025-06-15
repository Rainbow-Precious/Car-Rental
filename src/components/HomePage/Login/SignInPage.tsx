import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper, Grid } from "@mui/material";
import { toast } from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      toast.success("Login successful!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)",
        p: 0,
        m: 0,
      }}
    >
      <Grid
        container
        sx={{
          height: "80vh",
          maxWidth: 900,
          boxShadow: 6,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Left Side - Image and Brand */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#1E90FF",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(30,144,255,0.7)",
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              color: "white",
              textAlign: "center",
              px: 4,
            }}
          >
            <Typography variant="h3" fontWeight={800} mb={2}>
              Welcome Back!
            </Typography>
            <Typography variant="h6" fontWeight={400} mb={4}>
              Login to manage your car rentals and bookings with DriveEase.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Premium cars. Seamless experience.
            </Typography>
          </Box>
        </Grid>
        {/* Right Side - Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.85)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              maxWidth: 400,
              width: "100%",
              borderRadius: 3,
              boxShadow: 0,
              bgcolor: "transparent",
            }}
          >
            <Typography variant="h4" fontWeight={700} mb={2} color="#1E90FF">
              Login to DriveEase
            </Typography>
            <Typography variant="body1" mb={3} color="text.secondary">
              Welcome back! Please enter your credentials to access your
              account.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <Typography color="error" variant="body2" mt={1}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "1rem",
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #1E90FF 0%, #00C6FB 100%)",
                  boxShadow: "0 4px 16px 0 rgba(30,144,255,0.10)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #00C6FB 0%, #1E90FF 100%)",
                    boxShadow: "0 6px 24px 0 rgba(30,144,255,0.15)",
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline",
                    color: "text.secondary",
                    fontSize: "0.95rem",
                  }}
                >
                  Don't have an account?{" "}
                </Typography>
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 3,
                    padding: "8px 24px",
                    background:
                      "linear-gradient(90deg, #00C6FB 0%, #1E90FF 100%)",
                    color: "white",
                    boxShadow: "0 2px 8px 0 rgba(30,144,255,0.10)",
                    marginLeft: 8,
                    transition: "all 0.2s",
                    display: "inline-block",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Register
                </Link>
              </Box>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: "#1E90FF",
                    fontSize: "1rem",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    transition: "color 0.2s",
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
