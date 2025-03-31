import React from "react";
import { Route, Routes } from "react-router-dom"; // ✅ Remove BrowserRouter here
import "./App.css";
import HomePage from "./Components/IT22101488/HomePage";
import SolarInputs from "./Components/IT22101488/SolarInputs";
import MonitoringDashboard from "./Components/IT22101488/MonitoringDashboard";
// import PaymentPage from "./Components/IT22259448/PaymentPage";
// import MembershipPage from "./Components/IT22259448/MembershipPage";
import Navbar from "./NavBar/navbar";
import SolarDetails from "./Components/IT22101488/SolarDetails";
// import MembershipDetails from "./Components/IT22259448/MembershipDetails";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
// import UserDashboard from "./pages/adminDashboard/AdminDashboard";
// import UserProfile from "./pages/adminDashboard/AdminProfile";
// import Feedback from "./Components/IT22169044/Feedback";
// import Contact from "./Components/IT22169044/ContactUs";
// import FeedbackAdmin from "./Components/IT22169044/feedbackAdmin";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/SolarInputs" element={<SolarInputs />} />
        <Route path="/MonitoringDashboard" element={<MonitoringDashboard />} />
        <Route path="/SolarDetails" element={<SolarDetails />} />
        {/* <Route path="/PaymentPage" element={<PaymentPage />} /> */}
        {/* <Route path="/MembershipPage" element={<MembershipPage />} />
        <Route path="/MembershipDetails" element={<MembershipDetails />} /> */}
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/FeedbackAdmin" element={<FeedbackAdmin />} /> */}
      </Routes>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h2>404 - Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App;
