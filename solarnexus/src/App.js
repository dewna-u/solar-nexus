import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/IT22101488/HomePage";
import SolarInputs from "./Components/IT22101488/SolarInputs";
import MonitoringDashboard from "./Components/IT22101488/MonitoringDashboard";
import PaymentPage from "./Components/IT22259448/Payment";
import MembershipPage from "./Components/IT22259448/MembershipPage";
import Navbar from "./NavBar/navbar";
import SolarDetails from "./Components/IT22101488/SolarDetails"; // Import new page
import MembershipDetails from "./Components/IT22259448/MembershipDetails";
import CancelMembership from "./Components/IT22259448/CancelMembership";
import ChangeMembership from "./Components/IT22259448/ChangeMembership";
import Feedback from "./Components/IT22169044/Feedback";
import Contact from "./Components/IT22169044/ContactUs";
import AdminContact from "./Components/IT22169044/AdminContactDashboard";
import FeedbackAdmin from "./Components/IT22169044/feedbackAdmin";






function NotFound() {
  return (
    <div>
      <h2>404 - Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/SolarInputs" element={<SolarInputs />} />
          <Route path="/MonitoringDashboard" element={<MonitoringDashboard />} />
          <Route path="/SolarDetails" element={<SolarDetails />} /> {/* New Route */}
          <Route path="/PaymentPage" element={<PaymentPage />} />
          <Route path="/MembershipPage" element={<MembershipPage />} />
          <Route path="/MembershipDetails" element={<MembershipDetails />} />
          <Route path="/CancelMembership" element={<CancelMembership/>} />
          <Route path="/ChangeMembership" element={<ChangeMembership/>} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/FeedbackAdmin" element={<FeedbackAdmin />} />
          <Route path="/AdminContact" element={<AdminContact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
