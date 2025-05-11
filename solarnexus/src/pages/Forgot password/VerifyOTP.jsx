import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail"); // Store email temporarily

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert("OTP Verified Successfully!");
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} textAlign="center">
        <Typography variant="h4">Verify OTP</Typography>
        <form onSubmit={handleVerifyOTP}>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Verify OTP
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default VerifyOTP;
