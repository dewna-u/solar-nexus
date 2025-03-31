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

  return (
    <div className="container">
      <h2>Solar Monitoring Dashboard</h2>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Current Power Output</h3>
          <p>{solarData ? `${solarData.totalCapacity} W` : "Loading..."}</p>
        </div>
        <div className="card">
          <h3>Total Energy Generated</h3>
          <p>{solarData ? `${(solarData.totalCapacity * 5).toFixed(2)} kWh` : "Loading..."}</p>
        </div>
        <div className="card">
          <h3>Weather Forecast</h3>
          <ul>
            {solarData && solarData.weather && solarData.weather.forecasts ? (
              solarData.weather.forecasts.slice(0, 3).map((day, index) => (
                <li key={index}>
                  {`Day ${index + 1}: ${day.day.phrase} - ${day.temperature.minimum.value}°C`}
                </li>
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
