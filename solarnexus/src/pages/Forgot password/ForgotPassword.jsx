import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Dummy email validation (Replace with API call)
    if (email === "admin@example.com") {
      setMessage("An OTP has been sent to your email to reset your password.");
      setTimeout(() => navigate("/reset-password"), 3000);
    } else {
      setError("Email not found. Please enter a valid registered email.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleForgotPassword}>
          <TextField
            label="Enter your email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {message && (
            <Typography color="primary" variant="body2">
              {message}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Send OTP
          </Button>
        </form>
        <Typography mt={2}>
          <Button onClick={() => navigate("/login")} color="secondary">
            Back to Login
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
