import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface Booking {
  id: string;
  customerId: string;
  carId: string;
  startDate: string;
  endDate: string;
  status: "pending" | "active" | "completed" | "cancelled";
  totalPrice: number;
}

interface Customer {
  id: string;
  name: string;
}

interface Car {
  id: string;
  make: string;
  model: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    carId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    status: "pending" as "pending" | "active" | "completed" | "cancelled",
    totalPrice: 0,
  });

  // Mock data for customers and cars
  const [customers] = useState<Customer[]>([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ]);

  const [cars] = useState<Car[]>([
    { id: "1", make: "Toyota", model: "Camry" },
    { id: "2", make: "Honda", model: "Civic" },
  ]);

  const handleOpenDialog = (booking?: Booking) => {
    if (booking) {
      setSelectedBooking(booking);
      setFormData(booking);
    } else {
      setSelectedBooking(null);
      setFormData({
        customerId: "",
        carId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        status: "pending" as "pending" | "active" | "completed" | "cancelled",
        totalPrice: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handleSubmit = () => {
    if (selectedBooking) {
      // Update existing booking
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...formData, id: booking.id }
            : booking
        )
      );
    } else {
      // Add new booking
      setBookings([...bookings, { ...formData, id: Date.now().toString() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown";
  };

  const getCarDetails = (carId: string) => {
    const car = cars.find((c) => c.id === carId);
    return car ? `${car.make} ${car.model}` : "Unknown";
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Booking Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Booking
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Car</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{getCustomerName(booking.customerId)}</TableCell>
                <TableCell>{getCarDetails(booking.carId)}</TableCell>
                <TableCell>{booking.startDate}</TableCell>
                <TableCell>{booking.endDate}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>${booking.totalPrice}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog(booking)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(booking.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedBooking ? "Edit Booking" : "New Booking"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Customer</InputLabel>
              <Select
                value={formData.customerId}
                label="Customer"
                onChange={(e) =>
                  setFormData({ ...formData, customerId: e.target.value })
                }
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Car</InputLabel>
              <Select
                value={formData.carId}
                label="Car"
                onChange={(e) =>
                  setFormData({ ...formData, carId: e.target.value })
                }
              >
                {cars.map((car) => (
                  <MenuItem key={car.id} value={car.id}>
                    {car.make} {car.model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Booking["status"],
                  })
                }
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Total Price"
              type="number"
              value={formData.totalPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalPrice: parseFloat(e.target.value),
                })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedBooking ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingManagement;
