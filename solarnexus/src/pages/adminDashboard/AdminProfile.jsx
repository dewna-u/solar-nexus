import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Paper } from "@mui/material";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        console.log("🔑 Token:", token); // Debugging line to check the token

        if (!token) {
          setError("Unauthorized! Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `${token}` },
        });

        setUser(response.data);
      } catch (err) {
        console.error("🔥 Error fetching profile:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} component={Paper} elevation={3} borderRadius={2} textAlign="center">
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : user ? (
          <>
            <Typography variant="h6">First Name: {user.firstname}</Typography>
            <Typography variant="h6">Last Name: {user.lastname}</Typography>
            <Typography variant="h6">Address: {user.address}</Typography>
            <Typography variant="h6">Mobile Number: {user.mobilenumber}</Typography>
            <Typography variant="h6">Email: {user.email}</Typography>
          </>
        ) : null}
      </Box>
    </Container>
  );
};

export default UserProfile;