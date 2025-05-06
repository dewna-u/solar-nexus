import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/IT22101488/HomePage";
import SolarInputs from "./Components/IT22101488/SolarInputs";
import MonitoringDashboard from "./Components/IT22101488/MonitoringDashboard";
import SolarDetails from "./Components/IT22101488/SolarDetails";
import Navbar from "./NavBar/navbar";
import ChatBot from "./Components/IT22101488/ChatBot";
import MembershipPage from "./Components/IT22259448/MembershipPage";
import MembershipDetails from "./Components/IT22259448/New folder/MembershipDetails";
import Payment from "./Components/IT22259448/New folder/Payment";
import PaymentPage from "./Components/IT22259448/PaymentPage";
import AdminPayments from "./Components/IT22259448/AdminPayments";
import AdminContact from "./Components/IT22169044/AdminContactDashboard";
import Feedback from "./Components/IT22169044/Feedback";
import ContactUs from "./Components/IT22169044/ContactUs";
import FeedbackList from "./Components/IT22169044/FeedbackList";
import feedbackAdmin from "./Components/IT22169044/feedbackAdmin";
import AdminContactDashboard from "./Components/IT22169044/AdminContactDashboard";

function App() {
  // Neon cursor glow effect
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor-glow";
    document.body.appendChild(cursor);
  
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
  
    const followCursor = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(followCursor);
    };
  
    const mouseMoveHandler = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
  
    window.addEventListener("mousemove", mouseMoveHandler);
    followCursor();
  
    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      document.body.removeChild(cursor);
    };
  }, []);
  

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/FeedbackList" element={<FeedbackList />} />
        <Route path="/FeedbackAdmin" element={<feedbackAdmin />} />
        <Route path="/AdminContact" element={<AdminContactDashboard />} />
        <Route path="/AdminPayments" element={<AdminPayments />} />
        <Route path="/PaymentPage" element={<PaymentPage />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/MembershipDetails" element={<MembershipDetails />} />
        <Route path="/MembershipPage" element={<MembershipPage />} />
        <Route path="/ChatBot" element={<ChatBot />} />
        <Route path="/SolarInputs" element={<SolarInputs />} />
        <Route path="/MonitoringDashboard" element={<MonitoringDashboard />} />
        <Route path="/SolarDetails" element={<SolarDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App;
