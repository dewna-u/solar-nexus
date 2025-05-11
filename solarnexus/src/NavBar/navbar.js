import React from 'react';
import './navbar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li><a href="/MembershipPage">Monitoring</a></li>
                <li><a href="/MembershipPage">Membership</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#feedback">Feedback</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/forgotpassword">forgotpassword</a></li>
                <li><a href="/Register">Register</a></li>
                <li><a href="/admindashboard">AdminDashboard</a></li>
                <li><a href="/userprofile">userprofile</a></li>
                <li><a href="#ai-chatbot">AI Chatbot</a></li>
            </ul>
        </nav>
    );
};

export default NavBar;