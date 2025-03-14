import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl 
} from "@mui/material";

function SolarInputs() {
  const [formData, setFormData] = useState({
    numPanels: "",
    panelCapacity: "",
    location: "",
  });

  const navigate = useNavigate(); // Redirect function

  // Sri Lanka's 25 Districts
  const sriLankaDistricts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/solarInputs/add", formData);
      
      if (response.status === 201) {
        // Redirect to Monitoring Dashboard after successful submission
        navigate("/MonitoringDashboard", { state: { weatherData: response.data.data.weather } });
      }
    } catch (error) {
      console.error("Error submitting form:", error.response?.data?.message || error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Solar Inputs
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          
          {/* Number of Solar Panels */}
          <TextField
            label="Number of Solar Panels"
            type="number"
            name="numPanels"
            variant="outlined"
            fullWidth
            value={formData.numPanels}
            onChange={handleChange}
            required
          />

          {/* Capacity of Each Panel (kW) */}
          <TextField
            label="Capacity of Each Panel (kW)"
            type="number"
            name="panelCapacity"
            variant="outlined"
            fullWidth
            value={formData.panelCapacity}
            onChange={handleChange}
            required
          />

          {/* Location - District in Sri Lanka */}
          <FormControl fullWidth required>
            <InputLabel>Location (District in Sri Lanka)</InputLabel>
            <Select
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              {sriLankaDistricts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>

        {/* Monitor Button */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/MonitoringDashboard")}
        >
          Monitor
        </Button>
      </Box>
    </Container>
  );
}

export default SolarInputs;
