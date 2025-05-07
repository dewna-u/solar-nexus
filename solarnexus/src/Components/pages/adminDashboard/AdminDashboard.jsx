// src/pages/adminDashboard/AdminDashboard.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  TextField,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  SolarPower as SolarPowerIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  TableChart as TableChartIcon,
  WbSunny as WbSunnyIcon,
  CloudQueue as CloudIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const drawerWidth = 240;

export default function AdminDashboard() {
  const navigate = useNavigate();

  // redirect if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // dummy overview data
  const overview = {
    totalPanels: 200,
    totalCapacity: 400, // kW
    weather: "Partly Cloudy",
  };

  // dummy energy insights data
  const chartData = {
    labels: ["Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 6","Apr 7"],
    datasets: [
      {
        label: "2023",
        data: [30, 45, 28, 60, 50, 70, 90],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76,175,80,0.2)",
      },
      {
        label: "2024",
        data: [50, 60, 40, 80, 65, 95, 110],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33,150,243,0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  // dummy table data
  const tableRows = [
    { location: "Place A", panels: 25, capacity: 50, date: "Today" },
    { location: "Place B", panels: 75, capacity: 150, date: "Today" },
    { location: "Place C", panels: 50, capacity: 150, date: "Wed 8" },
    { location: "Place D", panels: 25, capacity: 35.22, date: "Tue 7" },
  ];

  // sidebar items
  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admindashboard" },
    { text: "Solar Inputs", icon: <SolarPowerIcon />, path: "/SolarDetails" },
    { text: "User Management", icon: <PeopleIcon />, path: "/userlist" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6">Admin Dashboard</Typography>
        </Toolbar>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          p: 3,
        }}
      >
        {/* Top App Bar */}
        <AppBar position="static" sx={{ ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <TextField
              size="small"
              placeholder="Search…"
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              sx={{ bgcolor: "white", borderRadius: 1, mr: 2, width: 200 }}
            />
            <Avatar
              sx={{ bgcolor: "#2196f3", cursor: "pointer" }}
              onClick={() => navigate("/userprofile")}
            >
              A
            </Avatar>
            <Button color="inherit" onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Overview Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <TableChartIcon sx={{ fontSize: 40, mr: 2 }} color="primary" />
                <Box>
                  <Typography variant="subtitle2">Total Panels</Typography>
                  <Typography variant="h5">{overview.totalPanels}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <SolarPowerIcon sx={{ fontSize: 40, mr: 2 }} color="success" />
                <Box>
                  <Typography variant="subtitle2">Total Capacity</Typography>
                  <Typography variant="h5">
                    {overview.totalCapacity} kW
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <CloudIcon sx={{ fontSize: 40, mr: 2 }} color="info" />
                <Box>
                  <Typography variant="subtitle2">Weather Forecast</Typography>
                  <Typography variant="h6">{overview.weather}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Energy Insights Chart */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Energy Insights
          </Typography>
          <Card elevation={3} sx={{ p: 2 }}>
            <Line data={chartData} options={chartOptions} />
          </Card>
        </Box>

        {/* Solar Input Data Table */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Solar Input Data
            <Button
              variant="contained"
              size="small"
              sx={{ float: "right" }}
            >
              Export Data
            </Button>
          </Typography>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Panels</TableCell>
                  <TableCell>Capacity (kW)</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.panels}</TableCell>
                    <TableCell>{row.capacity}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
