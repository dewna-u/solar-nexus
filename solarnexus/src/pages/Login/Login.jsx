import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data.token); // Log the response data for debugging
  
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Replace with actual token if using JWT
        alert("Login successful");
  
        // Redirect based on email/password
        if (email === "solaradmin@gmail.com" && password === "solaradmin123") {
          navigate("/admindashboard");
        } else {
          navigate("/HomePage");
        }
      }
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Server error");
    }
  };
  

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Side - Branding & Background */}
      <Grid
        item
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.2), rgba(0,0,0,0.6)), 
            url('https://images.unsplash.com/photo-1600390822404-c3896c1b14a5')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexDirection: "column",
          justifyContent: "center",
          p: 6,
          color: "#fff",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 30,
            left: 30,
            fontSize: 60,
            color: "gold",
            animation: "pulse 3s infinite ease-in-out",
          }}
        >
          ☀️
        </Box>

        <Box zIndex={1}>
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ color: "#fff" }}>
            Solar Nexus
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: "75%", color: "#e0f2f1" }}>
            Access your solar dashboard. Monitor real-time performance, get alerts, and optimize your energy usage.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Centered Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "80%", maxWidth: 400, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
            User Login
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#43a047", ":hover": { bgcolor: "#388e3c" } }}
            >
              Login
            </Button>
          </form>

          <Typography mt={2} textAlign="center">
            <Button onClick={() => navigate("/forgotpassword")} color="secondary">
              Forgot Password?
            </Button>
          </Typography>
        </Box>
      </Grid>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </Grid>
  );
};

export default Login;
