import React, { useState } from "react";
import "./App.css";
import HomePage from "./Components/IT22101488/HomePage";
import SolarInputs from "./Components/IT22101488/SolarInputs";
import MonitoringDashboard from "./Components/IT22101488/MonitoringDashboard";
import PaymentPage from "./Components/IT22101488/PaymentPage"; // Import Payment Page

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
        <SolarInputs 
          onNavigate={() => setCurrentPage("dashboard")} 
          onGoToPayment={() => setCurrentPage("payment")} // New navigation to payment page
        />
      )}
      {currentPage === "dashboard" && (
        <MonitoringDashboard onBack={() => setCurrentPage("home")} />
      )}
      {currentPage === "payment" && (
        <PaymentPage onBack={() => setCurrentPage("input")} /> // Back to Solar Inputs
      )}
    </div>
  );
}

export default App;