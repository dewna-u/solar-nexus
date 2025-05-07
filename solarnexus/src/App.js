// src/App.js
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./NavBar/navbar";
import LandingPage    from "./Components/IT22101488/LandingPage";
import HomePage       from "./Components/IT22101488/HomePage";
import Login          from "./Components/pages/Login/Login";
import Register       from "./Components/pages/Register/Register";
import ForgotPassword from "./Components/pages/ForgotPassword";
import ResetPassword  from "./Components/pages/Forgot password/ResetPassword";
import UserDashboard  from "./Components/pages/adminDashboard/AdminDashboard";
import UserProfile    from "./Components/pages/adminDashboard/AdminProfile";
import ContactUs      from "./Components/IT22169044/ContactUs";
import Feedback       from "./Components/IT22169044/Feedback";
import FeedbackList   from "./Components/IT22169044/FeedbackList";
import AdminContact   from "./Components/IT22169044/AdminContactDashboard";
import AdminPayments  from "./Components/IT22259448/AdminPayments";
import Payment        from "./Components/IT22259448/New folder/Payment";
import PaymentPage    from "./Components/IT22259448/PaymentPage";
import MembershipPage from "./Components/IT22259448/MembershipPage";
import MembershipDetails from "./Components/IT22259448/New folder/MembershipDetails";
import ChatBot        from "./Components/IT22101488/ChatBot";
import SolarInputs    from "./Components/IT22101488/SolarInputs";
import MonitoringDashboard from "./Components/IT22101488/MonitoringDashboard";
import SolarDetails   from "./Components/IT22101488/SolarDetails";
import UserList       from "./Components/pages/User/UserList";

function App() {
  // Neon cursor glow effect (unchanged)…
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor-glow";
    document.body.appendChild(cursor);
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    const follow = () => {
      curX += (mouseX - curX) * 0.1;
      curY += (mouseY - curY) * 0.1;
      cursor.style.transform = `translate(${curX}px,${curY}px)`;
      requestAnimationFrame(follow);
    };
    const move = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", move);
    follow();
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeChild(cursor);
    };
  }, []);

  // determine current path
  const { pathname } = useLocation();

  // list of paths where we DO NOT want the Navbar
  const noNavPaths = [
    "/",           // landing
    "/login",
    "/register",
    "/forgotpassword",
  ];

  // also hide navbar on any reset-password route
  const hideNavbar =
    noNavPaths.includes(pathname) ||
    pathname.startsWith("/reset_password");

  return (
    <div className="App">
      {/* only show on routes NOT in our noNavPaths list */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/HomePage" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset_password/:token" element={<ResetPassword />} />

        <Route path="/admindashboard" element={<UserDashboard />} />
        <Route path="/userprofile" element={<UserProfile />} />

        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/FeedbackList" element={<FeedbackList />} />
        <Route path="/AdminContact" element={<AdminContact />} />

        <Route path="/AdminPayments" element={<AdminPayments />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/PaymentPage" element={<PaymentPage />} />

        <Route path="/MembershipPage" element={<MembershipPage />} />
        <Route path="/MembershipDetails" element={<MembershipDetails />} />

        <Route path="/ChatBot" element={<ChatBot />} />
        <Route path="/SolarInputs" element={<SolarInputs />} />
        <Route path="/MonitoringDashboard" element={<MonitoringDashboard />} />
        <Route path="/SolarDetails" element={<SolarDetails />} />
        <Route path="/userlist" element={<UserList />} />

        {/* fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>404 - Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App;
