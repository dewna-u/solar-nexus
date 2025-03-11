import React from "react";
import "./MonitoringDashboard.css"; // Import the CSS file

function MonitoringDashboard({ onBack }) {
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement("h2", null, "Solar Monitoring Dashboard"),
    React.createElement(
      "div",
      { className: "dashboard-grid" },
      React.createElement(
        "div",
        { className: "card" },
        React.createElement("h3", null, "Current Power Output"),
        React.createElement("p", null, "500W")
      ),
      React.createElement(
        "div",
        { className: "card" },
        React.createElement("h3", null, "Battery Status"),
        React.createElement("p", null, "75% Charged")
      ),
      React.createElement(
        "div",
        { className: "card" },
        React.createElement("h3", null, "Total Energy Generated"),
        React.createElement("p", null, "12.5 kWh")
      ),
      React.createElement(
        "div",
        { className: "card" },
        React.createElement("h3", null, "System Health"),
        React.createElement("p", null, "Normal")
      )
    ),
    React.createElement("button", { className: "back-btn", onClick: onBack }, "Back") // Back Button
  );
}

export default MonitoringDashboard;
