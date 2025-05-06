import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function MonitoringDashboard({ onBack }) {
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/solarInputs");
        if (response.data.length > 0) {
          setSolarData(response.data[response.data.length - 1]);
        }
      } catch (error) {
        console.error("❌ Error fetching solar data:", error);
      }
    };

    fetchData();
  }, []);

  const totalEnergy = (forecast) => {
    if (!forecast) return "0.0";
    return (forecast.morning + forecast.noon + forecast.night).toFixed(1);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Solar Forecast Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Number of Panels", solarData?.numPanels || ""],
        ["Panel Capacity (kW)", solarData?.panelCapacity || ""],
        ["Location", solarData?.location || ""],
        ["Real-time Output", solarData?.totalCapacity + " W"],
        ["Estimated Today", (solarData?.totalCapacity * 5).toFixed(1) + " kWh"],
      ],
    });

    const secondTableY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: secondTableY,
      head: [["Time", "Morning", "Noon", "Night", "Total"]],
      body: [
        [
          "Day 1",
          `${solarData?.forecast?.day1?.morning?.toFixed(1) || "0"} kWh`,
          `${solarData?.forecast?.day1?.noon?.toFixed(1) || "0"} kWh`,
          `${solarData?.forecast?.day1?.night?.toFixed(1) || "0"} kWh`,
          `${totalEnergy(solarData?.forecast?.day1)} kWh`,
        ],
        [
          "Day 2",
          `${solarData?.forecast?.day2?.morning?.toFixed(1) || "0"} kWh`,
          `${solarData?.forecast?.day2?.noon?.toFixed(1) || "0"} kWh`,
          `${solarData?.forecast?.day2?.night?.toFixed(1) || "0"} kWh`,
          `${totalEnergy(solarData?.forecast?.day2)} kWh`,
        ],
      ],
    });

    doc.save("solar_forecast_report.pdf");
  };

  const chartData = {
    labels: ["Morning", "Noon", "Night"],
    datasets: [
      {
        label: "Day 1",
        data: solarData?.forecast
          ? [
              solarData.forecast.day1.morning,
              solarData.forecast.day1.noon,
              solarData.forecast.day1.night,
            ]
          : [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Day 2",
        data: solarData?.forecast
          ? [
              solarData.forecast.day2.morning,
              solarData.forecast.day2.noon,
              solarData.forecast.day2.night,
            ]
          : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>☀️ Solar Monitoring Dashboard</h2>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={exportToPDF} style={styles.pdfButton}>📄 Export to PDF</button>
      </div>

      <div style={styles.grid}>
        {[
          {
            title: "User Input Details",
            content: solarData && (
              <p style={styles.text}>
                <strong>Panels:</strong> {solarData.numPanels}<br />
                <strong>Capacity:</strong> {solarData.panelCapacity} kW<br />
                <strong>District:</strong> {solarData.location}
              </p>
            )
          },
          {
            title: "Power Output",
            content: <p style={styles.largeNumber}>
              {solarData ? `${solarData.totalCapacity} W` : "Loading..."}
            </p>
          },
          {
            title: "Today's Estimated Energy",
            content: <p style={styles.largeNumber}>
              {solarData ? `${(solarData.totalCapacity * 5).toFixed(1)} kWh` : "Loading..."}
            </p>
          },
          {
            title: "Day 1 Forecast",
            content: solarData?.forecast?.day1 ? (
              <>
                <div style={styles.weatherFlex}>
                  {["morning", "noon", "night"].map((period, i) => (
                    <div key={i}>
                      <div>{["☀️", "🌤️", "🌙"][i]}</div>
                      <small>{period.charAt(0).toUpperCase() + period.slice(1)}</small>
                      <div><strong>{solarData.forecast.day1[period].toFixed(1)} kWh</strong></div>
                    </div>
                  ))}
                </div>
                <p style={styles.total}>Total: {totalEnergy(solarData.forecast.day1)} kWh</p>
              </>
            ) : <p>Loading...</p>
          },
          {
            title: "Day 2 Forecast",
            content: solarData?.forecast?.day2 ? (
              <>
                <div style={styles.weatherFlex}>
                  {["morning", "noon", "night"].map((period, i) => (
                    <div key={i}>
                      <div>{["☀️", "🌤️", "🌙"][i]}</div>
                      <small>{period.charAt(0).toUpperCase() + period.slice(1)}</small>
                      <div><strong>{solarData.forecast.day2[period].toFixed(1)} kWh</strong></div>
                    </div>
                  ))}
                </div>
                <p style={styles.total}>Total: {totalEnergy(solarData.forecast.day2)} kWh</p>
              </>
            ) : <p>Loading...</p>
          },
          {
            title: "Energy Forecast Comparison",
            content: <Bar data={chartData} options={chartOptions} />
          }
        ].map((section, index) => (
          <div style={styles.card} key={index}>
            <h3 style={styles.cardTitle}>{section.title}</h3>
            {section.content}
          </div>
        ))}
      </div>

      <button style={styles.button} onClick={onBack}>⬅ Back</button>
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
  title: {
    fontSize: "32px",
    fontWeight: 600,
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.35)",
    borderRadius: "16px",
    padding: "20px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
    color: "#000",
  },
  cardTitle: {
    fontSize: "20px",
    marginBottom: "12px",
  },
  largeNumber: {
    fontSize: "30px",
    fontWeight: "bold",
  },
  weatherFlex: {
    display: "flex",
    justifyContent: "space-around",
    gap: "12px",
    fontSize: "14px",
  },
  total: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#444",
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
  pdfButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.6",
  },
};

export default MonitoringDashboard;
