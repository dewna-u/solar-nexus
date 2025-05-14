import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SolarPower as SolarIcon,
  WorkspacePremium as MembershipIcon,
  ContactMail as ContactIcon,
  Feedback as FeedbackIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Membership", path: "/MembershipPage", icon: <MembershipIcon /> },
  { label: "Contact Us", path: "/ContactUs", icon: <ContactIcon /> },
  { label: "Feedback", path: "/Feedback", icon: <FeedbackIcon /> },
  { label: "AI Chatbot", path: "/ChatBot", icon: <ChatIcon /> },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? "" : "#121212";
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ width: 240, p: 2 }}>
      <List>
        {NAV_ITEMS.map(({ label, path, icon }) => (
          <ListItemButton
            key={label}
            component={Link}
            to={path}
            onClick={toggleDrawer}
            selected={pathname === path}
            sx={{ mb: 1, borderRadius: 1 }}
          >
            <ListItemIcon sx={{ color: darkMode ? "#fff" : "#000" }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ color: darkMode ? "#fff" : "#000" }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: 2, borderTop: 1, borderColor: "divider", pt: 2 }}>
        <ListItemButton
          component={Link}
          to="/userprofile"
          onClick={toggleDrawer}
          selected={pathname === "/userprofile"}
          sx={{ mb: 1, borderRadius: 1 }}
        >
          <ListItemIcon sx={{ color: darkMode ? "#fff" : "#000" }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            primaryTypographyProps={{ color: darkMode ? "#fff" : "#000" }}
          />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            toggleDrawer();
            handleLogout();
          }}
          sx={{ borderRadius: 1 }}
        >
          <ListItemIcon sx={{ color: darkMode ? "#fff" : "#000" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ color: darkMode ? "#fff" : "#000" }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 10, // Adds margin from the top
          left: "10px", // Adds margin from the left
          right: "10px", // Adds margin from the right
          borderRadius: "12px", // Makes the navbar rounded
          backdropFilter: "blur(10px)", // Adds a blur effect
          backgroundColor: darkMode
            ? "rgba(50, 50, 50, 0.8)" // Slight ash color for dark mode
            : "rgba(200, 200, 200, 0.8)", // Slight ash color for light mode
          color: darkMode ? "#fff" : "#000",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds shadow outline
        }}
      >
        <Toolbar>
          {/* Mobile menu */}
          <IconButton
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          {/* Brand */}
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              fontSize: "1.25rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center", // Align logo and text vertically
              gap: 1, // Add spacing between logo and text
            }}
          >
            <img
              src="/images/Ellipse 9.png" // Ensure the path is correct
              alt="Logo"
              style={{ height: "40px" }}
            />
            Solar Monitor
          </Button>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
            {NAV_ITEMS.map(({ label, path, icon }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                startIcon={icon}
                color={pathname === path ? "secondary" : "inherit"}
                sx={{ textTransform: "none" }}
              >
                {label}
              </Button>
            ))}

            {/* Profile */}
            <Button
              component={Link}
              to="/userprofile"
              startIcon={<PersonIcon />}
              color={pathname === "/userprofile" ? "secondary" : "inherit"}
              sx={{ textTransform: "none" }}
            >
              Profile
            </Button>

            {/* Logout */}
            <Button
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>

          {/* Theme toggle */}
          <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            backgroundColor: darkMode ? "#000" : "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Add padding to the main content */}
      <Box sx={{ mt: 12 }} />
    </>
  );
}