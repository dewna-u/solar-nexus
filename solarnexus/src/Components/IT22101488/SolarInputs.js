import React from "react";
import "./SolarInputs.css"; // Import the CSS file

function SolarInputs({ onNavigate }) {
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement("h2", null, "Solar Inputs"),
    React.createElement(
      "form",
      null,
      React.createElement("label", null, "Solar Panel Capacity (W):"),
      React.createElement("input", { type: "number", name: "capacity", placeholder: "Enter capacity", required: true }),

      React.createElement("label", null, "Sunlight Hours Per Day:"),
      React.createElement("input", { type: "number", name: "hours", placeholder: "Enter hours", required: true }),

      React.createElement("label", null, "Battery Storage (Ah):"),
      React.createElement("input", { type: "number", name: "battery", placeholder: "Enter storage capacity", required: true }),

      React.createElement("button", { type: "submit" }, "Submit")
    ),
    React.createElement("button", { className: "monitor-btn", onClick: onNavigate }, "Monitor") // Navigate Button
  );
}

export default SolarInputs;
