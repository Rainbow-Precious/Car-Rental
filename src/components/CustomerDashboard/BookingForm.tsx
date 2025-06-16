import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { toast } from "react-hot-toast";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  location?: string;
  rating?: number;
}

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  car: Car | null;
  onBookingSubmit: (bookingData: any) => void;
}

export default function BookingForm({
  open,
  onClose,
  car,
  onBookingSubmit,
}: BookingFormProps) {  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    driverLicense: "",
    phoneNumber: "",
    emergencyContact: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  const calculateTotalDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotalPrice = () => {
    if (!car) return 0;
    const days = calculateTotalDays();
    return days * car.price;
  };

  const handleSubmit = async () => {
    if (!car || !bookingData.startDate || !bookingData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }    if (bookingData.startDate && bookingData.endDate) {
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      if (startDate >= endDate) {
        toast.error("End date must be after start date");
        return;
      }
    }

    if (!bookingData.driverLicense || !bookingData.phoneNumber) {
      toast.error("Driver's license and phone number are required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));      const newBooking = {
        id: Date.now().toString(),
        carId: car.id,
        carDetails: `${car.make} ${car.model} (${car.year})`,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalDays: calculateTotalDays(),
        totalPrice: calculateTotalPrice(),
        status: "pending" as const,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        driverLicense: bookingData.driverLicense,
        phoneNumber: bookingData.phoneNumber,
        emergencyContact: bookingData.emergencyContact,
        specialRequests: bookingData.specialRequests,
      };

      onBookingSubmit(newBooking);
      toast.success("Booking submitted successfully!");
      onClose();
        // Reset form
      setBookingData({
        startDate: "",
        endDate: "",
        pickupLocation: "",
        dropoffLocation: "",
        driverLicense: "",
        phoneNumber: "",
        emergencyContact: "",
        specialRequests: "",
      });
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!car) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <DirectionsCarIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Book {car.make} {car.model}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Car Details Summary */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 3,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {car.make} {car.model} ({car.year})
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 20 }} />
                  <Typography>{car.location}</Typography>
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  ${car.price}/day
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>
                  Rating: {car.rating} ★
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {/* Rental Dates */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Rental Period
              </Typography>
            </Grid>            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pickup Date"
                type="date"
                value={bookingData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Return Date"
                type="date"
                value={bookingData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: bookingData.startDate || new Date().toISOString().split('T')[0]
                }}
                required
              />
            </Grid>

            {/* Location Details */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Location Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Pickup Location</InputLabel>
                <Select
                  value={bookingData.pickupLocation}
                  label="Pickup Location"
                  onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                >
                  <MenuItem value="Lagos Airport">Lagos Airport</MenuItem>
                  <MenuItem value="Abuja City Center">Abuja City Center</MenuItem>
                  <MenuItem value="Port Harcourt Downtown">Port Harcourt Downtown</MenuItem>
                  <MenuItem value="Kano Main Station">Kano Main Station</MenuItem>
                  <MenuItem value="Ibadan Central">Ibadan Central</MenuItem>
                  <MenuItem value="Enugu Hub">Enugu Hub</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dropoff Location</InputLabel>
                <Select
                  value={bookingData.dropoffLocation}
                  label="Dropoff Location"
                  onChange={(e) => handleInputChange("dropoffLocation", e.target.value)}
                >
                  <MenuItem value="Lagos Airport">Lagos Airport</MenuItem>
                  <MenuItem value="Abuja City Center">Abuja City Center</MenuItem>
                  <MenuItem value="Port Harcourt Downtown">Port Harcourt Downtown</MenuItem>
                  <MenuItem value="Kano Main Station">Kano Main Station</MenuItem>
                  <MenuItem value="Ibadan Central">Ibadan Central</MenuItem>
                  <MenuItem value="Enugu Hub">Enugu Hub</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Driver's License Number"
                value={bookingData.driverLicense}
                onChange={(e) => handleInputChange("driverLicense", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={bookingData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                value={bookingData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Special Requests"
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                multiline
                rows={2}
              />
            </Grid>

            {/* Pricing Summary */}
            {bookingData.startDate && bookingData.endDate && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Booking Summary
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Rental Period:</Typography>
                    <Typography fontWeight={600}>
                      {calculateTotalDays()} day{calculateTotalDays() !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Daily Rate:</Typography>
                    <Typography fontWeight={600}>${car.price}/day</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={700}>
                      Total Amount:
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      ${calculateTotalPrice()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              px: 4,
              fontWeight: 700,
            }}
          >
            {isSubmitting ? "Processing..." : `Book Now - $${calculateTotalPrice()}`}
          </Button>        </DialogActions>
      </Dialog>
    );
}
