import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HistoryIcon from "@mui/icons-material/History";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CancelIcon from "@mui/icons-material/Cancel";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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

interface Booking {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  status: "pending" | "active" | "completed" | "cancelled";
  totalPrice: number;
}

const mockUser = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const CustomerDashboard: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [availableCars, setAvailableCars] = useState<Car[]>([
    {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      price: 50,
      image:
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&q=80",
      location: "Lagos",
      rating: 4.5,
    },
    {
      id: "2",
      make: "Honda",
      model: "Civic",
      year: 2023,
      price: 45,
      image:
        "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&q=80",
      location: "Abuja",
      rating: 4.7,
    },
    {
      id: "3",
      make: "BMW",
      model: "3 Series",
      year: 2021,
      price: 120,
      image:
        "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&q=80",
      location: "Port Harcourt",
      rating: 4.9,
    },
    {
      id: "4",
      make: "Mercedes",
      model: "C-Class",
      year: 2022,
      price: 130,
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80",
      location: "Kano",
      rating: 4.8,
    },
    {
      id: "5",
      make: "Ford",
      model: "Focus",
      year: 2020,
      price: 40,
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80",
      location: "Ibadan",
      rating: 4.3,
    },
    {
      id: "6",
      make: "Audi",
      model: "A4",
      year: 2023,
      price: 110,
      image:
        "https://images.unsplash.com/photo-1503736317-1c1b1b1b1b1b?auto=format&fit=crop&q=80",
      location: "Enugu",
      rating: 4.6,
    },
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      carId: "1",
      startDate: "2024-03-20",
      endDate: "2024-03-25",
      status: "active",
      totalPrice: 250,
    },
  ]);

  // Add state for the add car form
  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    location: "",
    image: "",
    rating: "",
  });
  const [addCarSuccess, setAddCarSuccess] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getCarDetails = (carId: string) => {
    const car = availableCars.find((c) => c.id === carId);
    return car ? `${car.make} ${car.model}` : "Unknown";
  };

  const handleAddCarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const handleAddCar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !newCar.make ||
      !newCar.model ||
      !newCar.year ||
      !newCar.price ||
      !newCar.location ||
      !newCar.image ||
      !newCar.rating
    )
      return;
    setAvailableCars([
      ...availableCars,
      {
        id: (availableCars.length + 1).toString(),
        make: newCar.make,
        model: newCar.model,
        year: parseInt(newCar.year),
        price: parseFloat(newCar.price),
        image: newCar.image,
        location: newCar.location,
        rating: parseFloat(newCar.rating),
      },
    ]);
    setNewCar({
      make: "",
      model: "",
      year: "",
      price: "",
      location: "",
      image: "",
      rating: "",
    });
    setAddCarSuccess(true);
    setTimeout(() => setAddCarSuccess(false), 2000);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#f4f6fb",
        p: { xs: 1, md: 3 },
      }}
    >
      {/* Welcome Banner with Profile/Settings Menu */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          bgcolor: theme.palette.primary.main,
          color: "white",
          borderRadius: 3,
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 3 },
          mb: 4,
          boxShadow: 2,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: "1.3rem", md: "2rem" } }}
          >
            Welcome back, {mockUser.name.split(" ")[0]}!
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.85, fontSize: { xs: "1rem", md: "1.1rem" } }}
          >
            Ready to book your next ride?
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              src={mockUser.avatar}
              alt={mockUser.name}
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                border: "3px solid white",
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>
              <PersonIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Tabs with Icons, scrollable on mobile */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { height: 4, borderRadius: 2 } }}
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: { xs: "flex-start", md: "space-between" },
              gap: { xs: 1, md: 8 },
            },
            fontWeight: 700,
          }}
        >
          <Tab
            icon={<DirectionsCarIcon />}
            label="Available Cars"
            sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 } }}
          />
          <Tab
            icon={<BookOnlineIcon />}
            label="My Bookings"
            sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 } }}
          />
          <Tab
            icon={<HistoryIcon />}
            label="Booking History"
            sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 } }}
          />
          <Tab
            icon={<AddCircleOutlineIcon />}
            label="List Your Car"
            sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 } }}
          />
        </Tabs>
      </Box>

      {/* Available Cars */}
      {activeTab === 0 && (
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {availableCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.03)",
                    boxShadow: 8,
                  },
                  bgcolor: "white",
                  color: "#23232a",
                }}
              >
                <CardMedia
                  component="img"
                  height={180}
                  image={car.image}
                  alt={`${car.make} ${car.model}`}
                  sx={{
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                  >
                    {car.make} {car.model}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: "0.97rem", md: "1rem" } }}
                  >
                    Year: {car.year} &nbsp;|&nbsp; {car.location}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: "0.97rem", md: "1rem" } }}
                  >
                    Rating: {car.rating} ★
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    mt={1}
                    mb={2}
                    sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                  >
                    ${car.price}/day
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      py: 1,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* My Bookings */}
      {activeTab === 1 && (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              bgcolor: "white",
              color: "#23232a",
              minWidth: 600,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f4f6fb" }}>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Car
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    End Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Total Price
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking, idx) => (
                  <TableRow
                    key={booking.id}
                    sx={{ bgcolor: idx % 2 === 0 ? "#f4f6fb" : "white" }}
                  >
                    <TableCell
                      sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                    >
                      {getCarDetails(booking.carId)}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                    >
                      {booking.startDate}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                    >
                      {booking.endDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#23232a",
                        textTransform: "capitalize",
                        fontSize: { xs: 13, md: 16 },
                      }}
                    >
                      {booking.status}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                    >
                      ${booking.totalPrice}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        disabled={booking.status !== "pending"}
                        sx={{
                          bgcolor: "#f4f6fb",
                          "&:hover": { bgcolor: "#ff1744", color: "white" },
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Booking History */}
      {activeTab === 2 && (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              bgcolor: "white",
              color: "#23232a",
              minWidth: 600,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f4f6fb" }}>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Car
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    End Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#23232a",
                      fontWeight: 700,
                      fontSize: { xs: 13, md: 16 },
                    }}
                  >
                    Total Price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings
                  .filter((booking) => booking.status === "completed")
                  .map((booking, idx) => (
                    <TableRow
                      key={booking.id}
                      sx={{ bgcolor: idx % 2 === 0 ? "#f4f6fb" : "white" }}
                    >
                      <TableCell
                        sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                      >
                        {getCarDetails(booking.carId)}
                      </TableCell>
                      <TableCell
                        sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                      >
                        {booking.startDate}
                      </TableCell>
                      <TableCell
                        sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                      >
                        {booking.endDate}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#23232a",
                          textTransform: "capitalize",
                          fontSize: { xs: 13, md: 16 },
                        }}
                      >
                        {booking.status}
                      </TableCell>
                      <TableCell
                        sx={{ color: "#23232a", fontSize: { xs: 13, md: 16 } }}
                      >
                        ${booking.totalPrice}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* List Your Car Tab */}
      {activeTab === 3 && (
        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            bgcolor: "white",
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            color="primary"
            sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
          >
            List Your Car for Rent
          </Typography>
          <form onSubmit={handleAddCar}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <input
                  name="make"
                  placeholder="Make"
                  value={newCar.make}
                  onChange={handleAddCarChange}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 8,
                    fontSize: "1rem",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  name="model"
                  placeholder="Model"
                  value={newCar.model}
                  onChange={handleAddCarChange}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 8,
                    fontSize: "1rem",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  name="year"
                  placeholder="Year"
                  type="number"
                  value={newCar.year}
                  onChange={handleAddCarChange}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 8,
                    fontSize: "1rem",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  name="price"
                  placeholder="Price per day"
                  type="number"
                  value={newCar.price}
                  onChange={handleAddCarChange}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 8,
                    fontSize: "1rem",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  name="location"
                  placeholder="Location"
                  value={newCar.location}
                  onChange={handleAddCarChange}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 8,
                    fontSize: "1rem",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  name="image"
                  placeholder="Image URL"
                  value={newCar.image}
                  onChange={handleAddCarChange}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 8,
                    fontSize: "1rem",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  name="rating"
                  placeholder="Rating"
                  type="number"
                  step="0.1"
                  value={newCar.rating}
                  onChange={handleAddCarChange}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 8,
                    fontSize: "1rem",
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                fontWeight: 700,
                borderRadius: 2,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
              fullWidth
            >
              Add Car
            </Button>
            {addCarSuccess && (
              <Typography
                color="success.main"
                mt={2}
                align="center"
                sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
              >
                Car added successfully!
              </Typography>
            )}
          </form>
        </Box>
      )}
    </Box>
  );
};

export default CustomerDashboard;
