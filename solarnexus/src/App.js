import React, { useState } from "react";
import "./App.css";
import SolarInputs from "./Components/IT22101488/SolarInputs";
import MonitoringDashboard from "./Components/IT22101488/MonitoringDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("input"); // "input" or "dashboard"

  return React.createElement(
    "div",
    { className: "App" },
    currentPage === "input"
      ? React.createElement(SolarInputs, { onNavigate: () => setCurrentPage("dashboard") })
      : React.createElement(MonitoringDashboard, { onBack: () => setCurrentPage("input") })
  );
}

export default App;
