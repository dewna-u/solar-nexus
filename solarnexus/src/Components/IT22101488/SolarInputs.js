import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./SolarInputs.css"; // Import the CSS file

function SolarInputs() {
  // State variables for form fields
  const [formData, setFormData] = useState({
    capacity: "",
    hours: "",
    battery: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/solarInputs/add", formData);
      alert("Solar input saved successfully!");
      setFormData({ capacity: "", hours: "", battery: "" }); // Clear the form

      // Navigate to SolarDetails page after submission
      navigate("/SolarDetails");
    } catch (error) {
      alert("Error saving data. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Solar Inputs</h2>
      <form onSubmit={handleSubmit}>
        <label>Solar Panel Capacity (W):</label>
        <input 
          type="number" 
          name="capacity" 
          placeholder="Enter capacity" 
          value={formData.capacity} 
          onChange={handleChange} 
          required 
        />

        <label>Sunlight Hours Per Day:</label>
        <input 
          type="number" 
          name="hours" 
          placeholder="Enter hours" 
          value={formData.hours} 
          onChange={handleChange} 
          required 
        />

        <label>Battery Storage (Ah):</label>
        <input 
          type="number" 
          name="battery" 
          placeholder="Enter storage capacity" 
          value={formData.battery} 
          onChange={handleChange} 
          required 
        />

        <button type="submit">Submit</button>
      </form>
      <button className="monitor-btn" onClick={() => navigate("/MonitoringDashboard")}>Monitor</button> {/* Navigate to MonitoringDashboard */}
    </div>
  );
}

export default SolarInputs;
