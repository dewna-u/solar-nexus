import React from "react";
import "./HomePage.css";

function HomePage({ onGoToSolarInputs, onGoToDashboard, onGoToPayment }) {
  return (
    <div className="home-container">
      <h1>Welcome to Solar Nexus</h1>
      <p>Navigate to different sections of the Solar Monitoring System</p>

      <div className="button-container">
        <button className="home-btn" onClick={onGoToSolarInputs}>
          Solar Inputs
        </button>
        <button className="home-btn" onClick={onGoToDashboard}>
          Solar Monitor
        </button>
        <button className="home-btn" onClick={onGoToPayment}>
          Payment Page
        </button> 
      </div>
    </div>
  );
}

export default HomePage;
