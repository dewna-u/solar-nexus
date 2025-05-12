import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert,
  Snackbar,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  SolarPower,
  Speed,
  LocationOn,
  Send,
  Dashboard,
} from "@mui/icons-material";

// Custom theme for solar application
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green for solar/eco theme
      light: "#60ad5e",
      dark: "#005005",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff9800", // Orange for sun/energy
      light: "#ffc947",
      dark: "#c66900",
      contrastText: "#000000",
    },
    background: {
      default: "#f8f9fa",
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "10px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
  },
});

function SolarInputs() {
  const [formData, setFormData] = useState({
    numPanels: "",
    panelCapacity: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const sriLankaDistricts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      numPanels: parseInt(formData.numPanels),
      panelCapacity: parseFloat(formData.panelCapacity),
      location: formData.location,
    };

    console.log("🚀 Submitting form:", payload);

    try {
      const response = await axios.post("http://localhost:5000/api/solarInputs/add", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("✅ Success:", response.data);
        navigate("/MonitoringDashboard", {
          state: { weatherData: response.data.data.weather }
        });
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || error.message);
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          background: "linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SolarPower sx={{ fontSize: 36, color: "primary.main", mr: 2 }} />
                  <Typography variant="h4" color="primary.main">
                    Solar Panel Configuration
                  </Typography>
                </Box>
              }
              subheader="Enter your solar panel details to get energy forecasts"
              sx={{ pb: 0 }}
            />

            <CardContent sx={{ pt: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Number of Solar Panels"
                      name="numPanels"
                      type="number"
                      value={formData.numPanels}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <SolarPower color="primary" sx={{ mr: 1 }} />
                        ),
                      }}
                      helperText="Enter the total number of panels in your system"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Capacity of Each Panel"
                      name="panelCapacity"
                      type="number"
                      value={formData.panelCapacity}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <Speed color="primary" sx={{ mr: 1 }} />
                        ),
                        endAdornment: "kW",
                      }}
                      helperText="Enter the capacity of each panel in kilowatts"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="location-label">District in Sri Lanka</InputLabel>
                      <Select
                        labelId="location-label"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        label="District in Sri Lanka"
                        startAdornment={
                          <LocationOn color="primary" sx={{ mr: 1 }} />
                        }
                      >
                        <MenuItem value="" disabled>
                          <em>Select a district</em>
                        </MenuItem>
                        {sriLankaDistricts.map((district) => (
                          <MenuItem key={district} value={district}>
                            {district}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<Dashboard />}
                    onClick={() => navigate("/MonitoringDashboard")}
                  >
                    Go to Dashboard
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Send />}
                  >
                    Submit Configuration
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "rgba(255, 255, 255, 0.7)",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                This system will calculate your solar energy production forecast based on your panel configuration and location weather data.
              </Typography>
            </Paper>
          </Box>
        </Container>

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {error || "An error occurred during submission"}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default SolarInputs;