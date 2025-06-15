import React, { useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Grid,
  Paper,
  Fade,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ConstructionIcon from "@mui/icons-material/Construction";

const drawerWidth = 240;

const mockUser = {
  name: "Admin User",
  avatar: "https://randomuser.me/api/portraits/men/45.jpg",
};

const quickStats = [
  {
    label: "Total Cars",
    value: 120,
    icon: <DirectionsCarIcon color="primary" />,
  },
  { label: "Customers", value: 350, icon: <PeopleIcon color="primary" /> },
  { label: "Bookings", value: 210, icon: <BookOnlineIcon color="primary" /> },
  {
    label: "Revenue",
    value: "$45,000",
    icon: <BarChartIcon color="primary" />,
  },
];

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, key: "dashboard" },
  { label: "Cars", icon: <DirectionsCarIcon />, key: "cars" },
  { label: "Customers", icon: <PeopleIcon />, key: "customers" },
  { label: "Bookings", icon: <BookOnlineIcon />, key: "bookings" },
  { label: "Analytics", icon: <BarChartIcon />, key: "analytics" },
  { label: "Settings", icon: <SettingsIcon />, key: "settings" },
];

const DashboardHome: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleMenuClick = (key: string) => {
    setSelectedMenu(key);
    setMobileOpen(false);
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Sidebar
  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "#23232a", color: "white" }}>
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #333" }}>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          Admin Panel
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.key}
            selected={selectedMenu === item.key}
            onClick={() => handleMenuClick(item.key)}
            sx={{
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
              },
              borderRadius: 2,
              mx: 1,
              my: 0.5,
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Main content for dashboard overview
  const dashboardOverview = (
    <Box sx={{ p: { xs: 1.5, md: 4 }, width: "100%", height: "100%", flex: 1 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
        color="primary.main"
        sx={{ fontSize: { xs: "1.3rem", md: "2rem" } }}
      >
        Dashboard Overview
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {quickStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                display: "flex",
                alignItems: "center",
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <Box sx={{ mr: 2 }}>{stat.icon}</Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.97rem", md: "1rem" } }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: { xs: 3, md: 5 } }}>
        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
          sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
        >
          Welcome to the Admin Dashboard! Select a section from the sidebar to
          manage cars, customers, bookings, analytics, and more.
        </Typography>
      </Box>
    </Box>
  );

  // Placeholder for other sections with animation
  const sectionPlaceholder = (label: string) => (
    <Box
      sx={{
        p: { xs: 1.5, md: 4 },
        width: "100%",
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      <Fade in={true} timeout={1000}>
        <Box sx={{ textAlign: "center" }}>
          <ConstructionIcon
            sx={{ fontSize: { xs: 40, md: 60 }, color: "primary.main", mb: 2 }}
          />
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary.main"
            mb={2}
            sx={{ fontSize: { xs: "1.2rem", md: "2rem" } }}
          >
            {label}
          </Typography>
          <Typography
            color="text.secondary"
            mb={2}
            sx={{ fontSize: { xs: "0.97rem", md: "1rem" } }}
          >
            This section is under construction.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f4f6fb",
      }}
    >
      {/* AppBar - Full width */}
      <AppBar
        position="static"
        color="inherit"
        elevation={1}
        sx={{
          borderBottom: "1px solid #e0e0e0",
          width: "100vw",
          px: { xs: 1, md: 0 },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, md: 64 },
            px: { xs: 0.5, md: 2 },
          }}
        >
          {/* Hamburger menu for mobile */}
          <IconButton
            color="primary"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="primary.main"
              align="center"
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              {menuItems.find((item) => item.key === selectedMenu)?.label}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar
                src={mockUser.avatar}
                alt={mockUser.name}
                sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 } }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleProfileMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Area: Sidebar + Content */}
      <Box sx={{ display: "flex", flex: 1, minHeight: 0, width: "100vw" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#23232a",
              color: "white",
            },
            display: { xs: "none", md: "block" },
          }}
          open
        >
          {drawer}
        </Drawer>
        {/* Mobile Sidebar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#23232a",
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            minHeight: "100vh",
            width: "100%",
            bgcolor: "#f4f6fb",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedMenu === "dashboard" && dashboardOverview}
          {selectedMenu !== "dashboard" &&
            sectionPlaceholder(
              menuItems.find((item) => item.key === selectedMenu)?.label || ""
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardHome;
