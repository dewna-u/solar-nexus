import { useState } from "react";
import { FaSun, FaBatteryFull, FaChartLine } from "react-icons/fa";

export default function SolarMonitoringSystem() {
  const [solarData, setSolarData] = useState({
    energyOutput: "Energy Output: 5.2 kW", 
    batteryStatus: "Battery Status: 80% Charged",
    efficiency: "Efficiency: 92%",
  });

  return (
    <div>
      <nav>Solar Monitoring System</nav>
      <div>
        <Card title={solarData.energyOutput} icon={<FaSun />} />
        <Card title={solarData.batteryStatus} icon={<FaBatteryFull />} />
        <Card title={solarData.efficiency} icon={<FaChartLine />} />
      </div>
    </div>
  );
}

function Card({ title, icon }) {
  return (
    <div>
      <div>{icon}</div>
      <div>
        <h3>{title}</h3>
      </div>
    </div>
  );
}
