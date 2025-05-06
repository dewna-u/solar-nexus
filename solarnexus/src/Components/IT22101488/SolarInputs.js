import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SolarInputs.css"; // Import your custom styles

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
      alert("Submission failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="solar-inputs-bg">
      <div className="solar-form-wrapper">
        <h2>Solar Panel Inputs</h2>
        <form onSubmit={handleSubmit} className="solar-form">
          <input
            type="number"
            name="numPanels"
            placeholder="Number of Solar Panels"
            value={formData.numPanels}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="panelCapacity"
            placeholder="Capacity of Each Panel (kW)"
            value={formData.panelCapacity}
            onChange={handleChange}
            required
          />

          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="">Select District in Sri Lanka</option>
            {sriLankaDistricts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="monitor-btn" onClick={() => navigate("/MonitoringDashboard")}>
            Monitor
          </button>
        </form>
      </div>
    </div>
  );
}

export default SolarInputs;
