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

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    mobilenumber: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (password) => password.length >= 6;
  const isValidMobile = (mobilenumber) => /^[0-9]{10}$/.test(mobilenumber);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!isValidMobile(formData.mobilenumber)) {
      setError("Mobile number must be 10 digits long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      console.error("🔥 Registration Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Server error, please try again.");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Content */}
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.2), rgba(0,0,0,0.6)),
            url('https://images.unsplash.com/photo-1600390822404-c3896c1b14a5')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
        }}
      >
        {/* Glowing Sun Icon */}
        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: 40,
            fontSize: 60,
            color: "gold",
            animation: "pulse 3s infinite ease-in-out",
          }}
        >
          ☀️
        </Box>

        <Box zIndex={1}>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Solar Nexus
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: "70%", color: "#e0f2f1" }}>
            Welcome to Solar Nexus – your smart solar energy monitoring system. Track power, analyze data, and shine brighter every day.
          </Typography>
        </Box>

        {/* Energy Wave (Optional Subtle Animation) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 30,
            left: 30,
            width: "80%",
            height: "40px",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.1), transparent 70%)",
            animation: "waveMove 4s infinite linear",
          }}
        />
      </Grid>

      {/* Right Form (Smaller width, outlined) */}
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f9fbe7",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #cfd8dc",
            borderRadius: 2,
            p: 4,
            width: "90%",
            maxWidth: 400,
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Create Your Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField label="First Name" name="firstname" fullWidth margin="normal" value={formData.firstname} onChange={handleChange} required />
            <TextField label="Last Name" name="lastname" fullWidth margin="normal" value={formData.lastname} onChange={handleChange} required />
            <TextField label="Address" name="address" fullWidth margin="normal" value={formData.address} onChange={handleChange} required />
            <TextField label="Mobile Number" name="mobilenumber" fullWidth margin="normal" value={formData.mobilenumber} onChange={handleChange} required />
            <TextField label="Email" name="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} required />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={formData.password} onChange={handleChange} required />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, bgcolor: "#43a047", ":hover": { bgcolor: "#388e3c" } }}>
              Register
            </Button>
          </form>

          <Typography mt={3} textAlign="center">
            Already have an account?{" "}
            <Button onClick={() => navigate("/login")} sx={{ color: "#2e7d32", fontWeight: "bold" }}>
              LOGIN HERE
            </Button>
          </Typography>
        </Paper>
      </Grid>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.85; }
        }
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(60px); }
        }
      `}</style>
    </Grid>
  );
};

export default Register;
