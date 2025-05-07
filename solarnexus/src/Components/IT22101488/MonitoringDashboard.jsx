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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function MonitoringDashboard({ onBack }) {
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
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
          {
            label: "Day After",
            data: [
              solarData.forecast.day2.morning,
              solarData.forecast.day2.noon,
              solarData.forecast.day2.night,
            ],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Loading data…</p>;
  }

  if (!solarData) {
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        No solar panel data found.
      </p>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>☀️ Solar Monitoring Dashboard</h2>

      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <button onClick={exportToPDF} style={styles.pdfButton}>
          📄 Export to PDF
        </button>
      </div>

      <div style={styles.grid}>
        {/* User Inputs */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>User Input Details</h3>
          <p style={styles.text}>
            <strong>Panels:</strong> {solarData.numPanels}
            <br />
            <strong>Capacity:</strong> {solarData.panelCapacity} kW
            <br />
            <strong>District:</strong> {solarData.location}
          </p>
        </div>

        {/* Real-time Output */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Power Output</h3>
          <p style={styles.largeNumber}>
            {solarData.totalCapacity} W
          </p>
        </div>

        {/* Today’s Estimate */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Today's Estimated Energy</h3>
          <p style={styles.largeNumber}>
            {(solarData.totalCapacity * 5).toFixed(1)} kWh
          </p>
        </div>

        {/* Day 1 Forecast */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Tomorrow's Forecast</h3>
          {solarData.forecast ? (
            <>
              <div style={styles.weatherFlex}>
                {["morning", "noon", "night"].map((period, i) => (
                  <div key={i}>
                    {["☀️","🌤️","🌙"][i]}
                    <br />
                    <small>{period.charAt(0).toUpperCase() + period.slice(1)}</small>
                    <br />
                    <strong>
                      {solarData.forecast.day1[period].toFixed(1)} kWh
                    </strong>
                  </div>
                ))}
              </div>
              <p style={styles.total}>
                Total: {totalEnergy(solarData.forecast.day1)} kWh
              </p>
            </>
          ) : (
            <p>No forecast data</p>
          )}
        </div>

        {/* Day 2 Forecast */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Day After Forecast</h3>
          {solarData.forecast ? (
            <>
              <div style={styles.weatherFlex}>
                {["morning", "noon", "night"].map((period, i) => (
                  <div key={i}>
                    {["☀️","🌤️","🌙"][i]}
                    <br />
                    <small>{period.charAt(0).toUpperCase() + period.slice(1)}</small>
                    <br />
                    <strong>
                      {solarData.forecast.day2[period].toFixed(1)} kWh
                    </strong>
                  </div>
                ))}
              </div>
              <p style={styles.total}>
                Total: {totalEnergy(solarData.forecast.day2)} kWh
              </p>
            </>
          ) : (
            <p>No forecast data</p>
          )}
        </div>

        {/* Chart */}
        {chartData && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Energy Forecast Comparison</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>

      <button style={styles.button} onClick={onBack}>
        ⬅ Back
      </button>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(to bottom, #fceabb, #f8b500)",
    fontFamily: "'Segoe UI', sans-serif",
    minHeight: "100vh",
    padding: "40px 20px",
    color: "#333",
    textAlign: "center",
  },
  title: { fontSize: "32px", fontWeight: 600, marginBottom: "30px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255,255,255,0.35)",
    borderRadius: "16px",
    padding: "20px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
    color: "#000",
  },
  cardTitle: { fontSize: "20px", marginBottom: "12px" },
  largeNumber: { fontSize: "30px", fontWeight: "bold" },
  weatherFlex: {
    display: "flex",
    justifyContent: "space-around",
    gap: "12px",
    fontSize: "14px",
  },
  total: { marginTop: "10px", fontWeight: "bold", color: "#444" },
  pdfButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  button: {
    marginTop: "30px",
    padding: "10px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ffffffcc",
    color: "#333",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    backdropFilter: "blur(6px)",
  },
  text: { fontSize: "16px", lineHeight: "1.6" },
};

export default MonitoringDashboard;
