import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";

function SolarInputs() {
  const [formData, setFormData] = useState({
    numPanels: "",
    panelCapacity: "",
    location: "",
  });

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
    try {
      const response = await axios.post("http://localhost:5000/api/solarInputs/add", formData);
      if (response.status === 201) {
        navigate("/MonitoringDashboard", { state: { weatherData: response.data.data.weather } });
      }
    } catch (error) {
      console.error("Error submitting form:", error.response?.data?.message || error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('../IT22101488/bigstock-Solar-panel-against-blue-sky-16564781-1\ \(1\).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Solar Panel Inputs
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}
          >
            <TextField
              label="Number of Solar Panels"
              type="number"
              name="numPanels"
              variant="outlined"
              fullWidth
              value={formData.numPanels}
              onChange={handleChange}
              required
              sx={{ borderRadius: 2 }}
            />

            <TextField
              label="Capacity of Each Panel (kW)"
              type="number"
              name="panelCapacity"
              variant="outlined"
              fullWidth
              value={formData.panelCapacity}
              onChange={handleChange}
              required
              sx={{ borderRadius: 2 }}
            />

            <FormControl fullWidth required>
              <InputLabel>Location (District in Sri Lanka)</InputLabel>
              <Select
                name="location"
                value={formData.location}
                onChange={handleChange}
                label="Location (District in Sri Lanka)"
                sx={{ borderRadius: 2 }}
              >
                {sriLankaDistricts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                transition: "0.3s",
                ":hover": {
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Submit
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/MonitoringDashboard")}
            >
              Monitor
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SolarInputs;
