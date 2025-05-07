// NavBar.jsx
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
  { label: "Monitoring", path: "/Monitoring", icon: <SolarIcon /> },
  { label: "Membership", path: "/MembershipPage", icon: <MembershipIcon /> },
  { label: "Contact Us", path: "/ContactUs", icon: <ContactIcon /> },
  { label: "Feedback", path: "/Feedback", icon: <FeedbackIcon /> },
  { label: "AI Chatbot", path: "/ChatBot", icon: <ChatIcon /> },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode]     = useState(false);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleTheme  = () => {
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

        <ListItemButton onClick={() => { toggleDrawer(); handleLogout(); }} sx={{ borderRadius: 1 }}>
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
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: darkMode ? "#000000" : "#cccccc",
          color: darkMode ? "#fff" : "#000",
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
            }}
          >
            ⚡ Solar Monitor
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
    </>
  );
}
