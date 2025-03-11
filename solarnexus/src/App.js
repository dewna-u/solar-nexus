import React, { useState } from "react";
import "./App.css";
import HomePage from "./Components/IT22101488/HomePage";
import SolarInputs from "./Components/IT22101488/SolarInputs";
import MonitoringDashboard from "./Components/IT22101488/MonitoringDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // "home", "input", "dashboard", "payment"

  return (
    <div className="App">
      {currentPage === "home" && (
        <HomePage
          onGoToSolarInputs={() => setCurrentPage("input")}
          onGoToDashboard={() => setCurrentPage("dashboard")}
        />
      )}
      {currentPage === "input" && (
        <SolarInputs onNavigate={() => setCurrentPage("dashboard")} />
      )}
      {currentPage === "dashboard" && (
        <MonitoringDashboard onBack={() => setCurrentPage("home")} />
      )}
    </div>
  );
}

export default App;
