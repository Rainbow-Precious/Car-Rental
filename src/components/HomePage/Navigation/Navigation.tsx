import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Container } from "@mui/material";

export default function Navigation() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <RouterLink
            to="/"
            style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
          >
            <Button
              color="inherit"
              sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              DriveEase Rentals
            </Button>
          </RouterLink>
          <Box>
            <Button color="inherit" component={RouterLink} to="/signin">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
