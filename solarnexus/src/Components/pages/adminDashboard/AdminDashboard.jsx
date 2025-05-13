import { useEffect, useState } from "react";
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
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Avatar,
  IconButton,
  Divider,
  useTheme,
  createTheme,
  ThemeProvider,
  Paper,
  Grid,
  Card,
  CardContent,
  alpha,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  SolarPower as SolarIcon,
  Payment as PaymentIcon,
  Feedback as FeedbackIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  BarChart as ChartIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";

// Custom theme for admin dashboard
const adminTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#388e3c",
      light: "#4caf50",
      dark: "#2e7d32",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.5px",
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1976d2",
          color: "#fff",
        },
      },
    },
  },
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = adminTheme;
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Mock data for dashboard stats
  const stats = [
    { title: "Total Users", value: "1,245", icon: <PeopleIcon />, color: theme.palette.primary.main },
    { title: "Active Systems", value: "32", icon: <SolarIcon />, color: theme.palette.secondary.main },
    { title: "Total Revenue", value: "$12,456", icon: <MoneyIcon />, color: "#ff9800" },
    { title: "Energy Generated", value: "1,245 kWh", icon: <LightbulbIcon />, color: "#f44336" },
  ];

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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: "Admin Profile", icon: <PersonIcon />, path: "/userlist" },
    { text: "Solar Monitoring", icon: <SolarIcon />, path: "/SolarDetails" },
    { text: "Payment", icon: <PaymentIcon />, path: "/adminpayments" },
    { text: "Feedback", icon: <FeedbackIcon />, path: "/FeedbackList" },
  ];

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white", display: { xs: "none", sm: "block" } }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "0 24px 24px 0",
                mr: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mt: "auto" }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: "0 24px 24px 0", mr: 2 }}>
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            bgcolor: "white",
            color: "text.primary",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Solar Energy Admin Dashboard
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <SettingsIcon />
              </IconButton>
              <Box sx={{ ml: 2 }}>
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                >
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
                </IconButton>
                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/settings")}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer - Desktop */}
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? 240 : 72,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerOpen ? 240 : 72,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
            display: { xs: "none", sm: "block" },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>

        {/* Sidebar Drawer - Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerOpen ? 240 : 72}px)` },
            ml: { sm: `${drawerOpen ? 240 : 72}px` },
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, monitor solar systems, handle payments, and review feedback.
            </Typography>
          </Box>

          {/* Dashboard Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Access */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Quick Access
          </Typography>
          <Grid container spacing={3}>
            {menuItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                    },
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <Avatar
                    sx={{
                      bgcolor: index === 0 ? theme.palette.primary.main :
                              index === 1 ? theme.palette.secondary.main :
                              index === 2 ? "#ff9800" : "#f44336",
                      width: 60,
                      height: 60,
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" align="center">
                    {item.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;