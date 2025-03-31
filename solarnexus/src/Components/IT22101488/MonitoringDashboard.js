import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MonitoringDashboard.css";

function MonitoringDashboard({ onBack }) {
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/solarInputs");

        if (response.data.length > 0) {
          setSolarData(response.data[response.data.length - 1]); // Get the latest entry
        }
      } catch (error) {
        console.error("❌ Error fetching solar data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to determine weather condition safely
  const getWeatherCondition = (day) => {
    if (!day || !day.phrase) {
      return "🌡️ Data Unavailable"; // Default text if phrase is missing
    }

    const lowerPhrase = day.phrase.toLowerCase();
    if (lowerPhrase.includes("sun") || lowerPhrase.includes("clear")) {
      return "☀️ Sunny";
    } else if (lowerPhrase.includes("rain")) {
      return "🌧️ Rainy";
    } else if (lowerPhrase.includes("cloud") || lowerPhrase.includes("overcast")) {
      return "☁️ Cloudy";
    } else {
      return "🌡️ Unknown";
    }
  };

  return (
    <div className="container">
      <h2>Solar Monitoring Dashboard</h2>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Current Power Output</h3>
          <p>{solarData ? `${solarData.totalCapacity} W` : "Loading..."}</p>
        </div>
        <div className="card">
          <h3>Battery Status</h3>
          <p>75% Charged</p>
        </div>
        <div className="card">
          <h3>Total Energy Generated</h3>
          <p>{solarData ? `${(solarData.totalCapacity * 5).toFixed(2)} kWh` : "Loading..."}</p>
        </div>
        <div className="card">
          <h3>System Health</h3>
          <p>Normal</p>
        </div>
        <div className="card">
          <h3>Weather Forecast</h3>
          <ul>
            {solarData && solarData.weather && solarData.weather.forecasts ? (
              solarData.weather.forecasts.slice(0, 5).map((day, index) => (
                <li key={index}>{`Day ${index + 1}: ${getWeatherCondition(day)}`}</li>
              ))
            ) : (
              <li>Loading weather data...</li>
            )}
          </ul>
        </div>
      </div>
      <button className="back-btn" onClick={onBack}>Back</button>
    </div>
  );
}

export default MonitoringDashboard;
