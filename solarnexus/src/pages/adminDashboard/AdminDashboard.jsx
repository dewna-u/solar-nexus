import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";

const UserDashboard = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token"); 
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear auth token
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/userlist")}>
              <ListItemText primary="Admin Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/SolarDetails")}>
              <ListItemText primary="Solar Monitoring" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/admincontactdashboard")}>
              <ListItemText primary="Contact Us" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/adminpayments")}>
              <ListItemText primary="Payment" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/userprofile")}>
              <ListItemText primary="Feedback" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 5, ml: "40px" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Typography variant="h4" sx={{ mt: 3 }}>
          Welcome to Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          View user profiles, Solar Monitoring, Contact Us,Payment,and Feedback.
        </Typography>
      </Box>
    </Box>
  );
};

export default UserDashboard;
