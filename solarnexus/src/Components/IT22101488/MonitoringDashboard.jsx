// src/Components/IT22101488/MonitoringDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  useTheme,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  ArrowBack,
  PictureAsPdf,
  WbSunny,
  Brightness4,
  NightsStay,
  Speed,
  BatteryChargingFull,
  LocationOn,
  BarChart,
  GridView,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Custom theme for solar dashboard
const solarTheme = createTheme({
  palette: {
    primary: {
      main: "#f57c00", // Orange for solar theme
      light: "#ffad42",
      dark: "#bb4d00",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2196f3", // Blue for contrast
      light: "#6ec6ff",
      dark: "#0069c0",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

function MonitoringDashboard({ onBack }) {
  const theme = useTheme();
  const navigate = useNavigate(); // Ensure navigate is initialized
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the latest solar input on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/solarInputs");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSolarData(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.error("❌ Error fetching solar data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Safely compute total energy from forecast segments
  const totalEnergy = (seg) => {
    if (!seg) return 0;
    return ((seg.morning || 0) + (seg.noon || 0) + (seg.night || 0)).toFixed(1);
  };

  // Export report to PDF
  const exportToPDF = () => {
    if (!solarData) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Solar Forecast Report", 14, 20);

    // Table 1: Inputs
    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Number of Panels", solarData.numPanels],
        ["Panel Capacity (kW)", solarData.panelCapacity],
        ["Location", solarData.location],
        ["Real-time Output", `${solarData.totalCapacity} W`],
        ["Estimated Today", `${(solarData.totalCapacity * 5).toFixed(1)} kWh`],
      ],
    });

    // Table 2: Forecast if available
    if (solarData.forecast) {
      const y = doc.lastAutoTable.finalY + 10;
      autoTable(doc, {
        startY: y,
        head: [["Day", "Morning", "Noon", "Night", "Total"]],
        body: [
          [
            "Tomorrow",
            `${solarData.forecast.day1.morning.toFixed(1)} kWh`,
            `${solarData.forecast.day1.noon.toFixed(1)} kWh`,
            `${solarData.forecast.day1.night.toFixed(1)} kWh`,
            `${totalEnergy(solarData.forecast.day1)} kWh`,
          ],
          [
            "Day After",
            `${solarData.forecast.day2.morning.toFixed(1)} kWh`,
            `${solarData.forecast.day2.noon.toFixed(1)} kWh`,
            `${solarData.forecast.day2.night.toFixed(1)} kWh`,
            `${totalEnergy(solarData.forecast.day2)} kWh`,
          ],
        ],
      });
    }

    doc.save("solar_forecast_report.pdf");
  };

  // Prepare chart data (only if forecast exists)
  const chartData = solarData?.forecast
    ? {
        labels: ["Morning", "Noon", "Night"],
        datasets: [
          {
            label: "Tomorrow",
            data: [
              solarData.forecast.day1.morning,
              solarData.forecast.day1.noon,
              solarData.forecast.day1.night,
            ],
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.dark,
            borderWidth: 1,
          },
          {
            label: "Day After",
            data: [
              solarData.forecast.day2.morning,
              solarData.forecast.day2.noon,
              solarData.forecast.day2.night,
            ],
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.dark,
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 10,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Energy (kWh)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading solar data...
        </Typography>
      </Box>
    );
  }

  if (!solarData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          p: 3,
        }}
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
          No solar panel data found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={solarTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
              }}
            >
              <WbSunny sx={{ mr: 1 }} /> Solar Monitoring Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              onClick={exportToPDF}
            >
              Export to PDF
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* User Inputs */}
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardHeader
                  title="System Configuration"
                  titleTypographyProps={{ variant: "h6" }}
                  avatar={<GridView color="primary" />}
                />
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Chip
                      label={`${solarData.numPanels} Panels`}
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${solarData.panelCapacity} kW`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <LocationOn color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {solarData.location}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Real-time Output */}
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardHeader
                  title="Current Power Output"
                  titleTypographyProps={{ variant: "h6" }}
                  avatar={<Speed color="primary" />}
                />
                <CardContent>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      textAlign: "center",
                      my: 2,
                    }}
                  >
                    {solarData.totalCapacity} W
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Today's Estimate */}
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardHeader
                  title="Today's Estimated Energy"
                  titleTypographyProps={{ variant: "h6" }}
                  avatar={<BatteryChargingFull color="primary" />}
                />
                <CardContent>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      textAlign: "center",
                      my: 2,
                    }}
                  >
                    {(solarData.totalCapacity * 5).toFixed(1)} kWh
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Day 1 Forecast */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader
                  title="Tomorrow's Forecast"
                  titleTypographyProps={{ variant: "h6" }}
                  avatar={<WbSunny color="primary" />}
                />
                <CardContent>
                  {solarData.forecast ? (
                    <>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                          { time: "Morning", icon: <WbSunny />, emoji: "☀️" },
                          { time: "Noon", icon: <Brightness4 />, emoji: "🌤️" },
                          { time: "Night", icon: <NightsStay />, emoji: "🌙" },
                        ].map((period, i) => (
                          <Grid
                            item
                            xs={4}
                            key={i}
                            sx={{ textAlign: "center" }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: "background.default",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                {period.emoji} {period.time}
                              </Typography>
                              <Typography
                                variant="h6"
                                color="primary.main"
                                sx={{ fontWeight: "bold" }}
                              >
                                {solarData.forecast.day1[
                                  period.time.toLowerCase()
                                ].toFixed(1)}{" "}
                                kWh
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ mr: 1 }}>
                          Total Energy:
                        </Typography>
                        <Chip
                          label={`${totalEnergy(
                            solarData.forecast.day1
                          )} kWh`}
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>
                    </>
                  ) : (
                    <Alert severity="info">No forecast data available</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Day 2 Forecast */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader
                  title="Day After Forecast"
                  titleTypographyProps={{ variant: "h6" }}
                  avatar={<WbSunny color="primary" />}
                />
                <CardContent>
                  {solarData.forecast ? (
                    <>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                          { time: "Morning", icon: <WbSunny />, emoji: "☀️" },
                          { time: "Noon", icon: <Brightness4 />, emoji: "🌤️" },
                          { time: "Night", icon: <NightsStay />, emoji: "🌙" },
                        ].map((period, i) => (
                          <Grid
                            item
                            xs={4}
                            key={i}
                            sx={{ textAlign: "center" }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: "background.default",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                {period.emoji} {period.time}
                              </Typography>
                              <Typography
                                variant="h6"
                                color="primary.main"
                                sx={{ fontWeight: "bold" }}
                              >
                                {solarData.forecast.day2[
                                  period.time.toLowerCase()
                                ].toFixed(1)}{" "}
                                kWh
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ mr: 1 }}>
                          Total Energy:
                        </Typography>
                        <Chip
                          label={`${totalEnergy(
                            solarData.forecast.day2
                          )} kWh`}
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>
                    </>
                  ) : (
                    <Alert severity="info">No forecast data available</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Chart */}
            {chartData && (
              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardHeader
                    title="Energy Forecast Comparison"
                    titleTypographyProps={{ variant: "h6" }}
                    avatar={<BarChart color="primary" />}
                  />
                  <CardContent>
                    <Box sx={{ height: 350, p: 1 }}>
                      <Bar data={chartData} options={chartOptions} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/HomePage")} // Navigate to /HomePage
              size="large"
            >
              Back to Main Page
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default MonitoringDashboard;