import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: "available" | "rented" | "maintenance";
  image: string;
}

const CarManagement: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    status: "available" as "available" | "rented" | "maintenance",
    image: "",
  });

  const handleOpenDialog = (car?: Car) => {
    if (car) {
      setSelectedCar(car);
      setFormData(car);
    } else {
      setSelectedCar(null);
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        status: "available" as "available" | "rented" | "maintenance",
        image: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCar(null);
  };

  const handleSubmit = () => {
    if (selectedCar) {
      // Update existing car
      setCars(
        cars.map((car) =>
          car.id === selectedCar.id ? { ...formData, id: car.id } : car
        )
      );
    } else {
      // Add new car
      setCars([...cars, { ...formData, id: Date.now().toString() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setCars(cars.filter((car) => car.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Car Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Car
        </Button>
      </Box>

      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={car.image || "https://via.placeholder.com/300x200"}
                  alt={`${car.make} ${car.model}`}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                  <IconButton
                    onClick={() => handleOpenDialog(car)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(car.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {car.make} {car.model}
              </Typography>
              <Typography color="text.secondary">Year: {car.year}</Typography>
              <Typography color="text.secondary">
                Price: ${car.price}/day
              </Typography>
              <Typography
                sx={{
                  color:
                    car.status === "available"
                      ? "success.main"
                      : car.status === "rented"
                      ? "error.main"
                      : "warning.main",
                }}
              >
                Status:{" "}
                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedCar ? "Edit Car" : "Add New Car"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Make"
              value={formData.make}
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Price per Day"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCar ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CarManagement;
