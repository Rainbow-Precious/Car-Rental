import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import { toast } from 'react-hot-toast';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from localStorage or use a default
    const storedEmail = localStorage.getItem('verificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email is found, redirect to signup
      navigate('/signup');
    }
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP code");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simulate API call with timeout
    setTimeout(() => {
      setSuccess("Email verified successfully!");
      toast.success("Email verified successfully!");
      
      // Redirect to sign-in after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
      setLoading(false);
    }, 1000);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Verify Your Email
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Please enter the verification code sent to {email}
          </Typography>
          <Box component="form" onSubmit={handleVerify} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Verification Code"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={!!error}
              helperText={error || success}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 