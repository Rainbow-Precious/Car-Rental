import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";

const carTypes = [
  "Sedan",
  "SUV",
  "Convertible",
  "Hatchback",
  "Luxury",
  "Van",
  "Pickup Truck",
];

interface BookCarFormProps {
  onClose: () => void;
  initialCarType?: string;
}

export default function BookCarForm({
  onClose,
  initialCarType,
}: BookCarFormProps) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    dropoffDate: "",
    carType: initialCarType || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialCarType) {
      setForm((prev) => ({ ...prev, carType: initialCarType }));
    }
  }, [initialCarType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    for (const key in form) {
      if (!form[key as keyof typeof form]) {
        setError("Please fill in all fields.");
        return;
      }
    }
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        width: { xs: "100%", sm: 370 },
        maxWidth: "100vw",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={2}
        color="#1E90FF"
        textAlign="center"
      >
        Book Your Car
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="you@email.com"
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="e.g. +1 555 123 4567"
              autoComplete="tel"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Pickup Location"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="Where do you want to pick up?"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Drop-off Location"
              name="dropoffLocation"
              value={form.dropoffLocation}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="Where do you want to drop off?"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Pickup Date & Time"
              name="pickupDate"
              type="datetime-local"
              value={form.pickupDate}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Drop-off Date & Time"
              name="dropoffDate"
              type="datetime-local"
              value={form.dropoffDate}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Car Type/Model"
              name="carType"
              value={form.carType}
              onChange={handleChange}
              select
              fullWidth
              margin="dense"
              required
              placeholder="Select car type"
            >
              {carTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" variant="body2" mt={1}>
                Rental request sent!
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              Rent Now
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
