import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: 'Nigeria'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Driver\'s license number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Registration successful! Welcome to DriveEase!');
      setIsLoading(false);
      // In a real app, you would redirect to dashboard or login
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)',
        p: 2,
        m: 0,
      }}
    >
      <Grid container sx={{ maxWidth: 1200, boxShadow: 6, borderRadius: 4, overflow: 'hidden', minHeight: '90vh' }}>
        {/* Left Side - Image and Brand */}
        <Grid item xs={12} md={6} sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#1E90FF',
          backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(30,144,255,0.7)',
            zIndex: 1,
          }} />
          <Box sx={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center', px: 4 }}>
            <Typography variant="h3" fontWeight={800} mb={2}>
              Join DriveEase!
            </Typography>
            <Typography variant="h6" fontWeight={400} mb={4}>
              Create your account and start your journey with premium car rentals.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Quick registration. Premium experience.
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Form */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.95)',
        }}>
          <Paper elevation={0} sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 3, boxShadow: 0, bgcolor: 'transparent', maxHeight: '90vh', overflowY: 'auto' }}>
            <Typography variant="h4" fontWeight={700} mb={2} color="#1E90FF">
              Create Account
            </Typography>
            <Typography variant="body1" mb={3} color="text.secondary">
              Join thousands of satisfied customers and start renting premium cars today.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Driver's License Number"
                    name="licenseNumber"
                    fullWidth
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    fullWidth
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      name="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))}
                      label="Country"
                    >
                      <MenuItem value="Nigeria">Nigeria</MenuItem>
                      <MenuItem value="Ghana">Ghana</MenuItem>
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="South Africa">South Africa</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="City"
                    name="city"
                    fullWidth
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    required
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #1E90FF 0%, #00C6FB 100%)',
                  boxShadow: '0 4px 16px 0 rgba(30,144,255,0.10)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00C6FB 0%, #1E90FF 100%)',
                    boxShadow: '0 6px 24px 0 rgba(30,144,255,0.15)',
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ display: 'inline', color: 'text.secondary', fontSize: '0.95rem' }}>
                  Already have an account?{' '}
                </Typography>
                <Link to="/signin" style={{
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 3,
                  padding: '8px 24px',
                  background: 'linear-gradient(90deg, #00C6FB 0%, #1E90FF 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px 0 rgba(30,144,255,0.10)',
                  marginLeft: 8,
                  transition: 'all 0.2s',
                  display: 'inline-block',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}>
                  Sign In
                </Link>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
