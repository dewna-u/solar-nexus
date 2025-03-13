
import "./HomePage.css";

function HomePage() {
  const onGoToSolarInputs = () => {
    window.location.href = "/SolarInputs";
  };
  const onGoToDashboard = () => {
    window.location.href = "/MonitoringDashboard";
  };  
  const onGoToPayment = () => {
    window.location.href = "/PaymentPage";
  };
  const onGoToMembership = () => {
    window.location.href = "/MembershipPage";
  };

  return (
    <div>
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
          <button className="home-btn" onClick={onGoToMembership}>
            Membership Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
