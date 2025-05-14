// frontend/MembershipPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  // grab token once
  const token = localStorage.getItem("token");

  const membershipPlans = [
    {
      id: "weekly",
      name: "Weekly",
      price: "LKR 750",
      amount: 750,
      benefits: ["Cancel anytime", "One-time payment"],
    },
    {
      id: "monthly",
      name: "Monthly",
      price: "LKR 2250",
      amount: 2250,
      benefits: ["One week free", "Cancel anytime", "One-time payment"],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "LKR 33000",
      amount: 33000,
      benefits: ["One month free", "Cancel anytime", "One-time payment"],
    },
  ];

  // POST to your backend, auth header included
  const handleSubmit = async () => {
    if (!selectedPlan) return;
    const planData = membershipPlans.find((p) => p.id === selectedPlan);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/membership",
        planData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Membership plan submitted successfully!");
      } else {
        console.error("Unexpected status:", response.status);
        alert("Failed to submit membership plan.");
      }
    } catch (err) {
      console.error("Error submitting membership:", err);
      alert("An error occurred while submitting.");
    }
  };

  // Submit + navigate to payment, passing plan via state
  const handleProceed = async () => {
    await handleSubmit();
    const planData = membershipPlans.find((p) => p.id === selectedPlan);
    navigate("/PaymentPage", { state: planData });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Membership Plan
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Select a membership plan to continue.
      </Typography>

      <Grid container spacing={3} justifyContent="center" mt={2} mb={4} maxWidth="md">
        {membershipPlans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              onClick={() => setSelectedPlan(plan.id)}
              sx={{
                cursor: "pointer",
                border: selectedPlan === plan.id ? "2px solid #1976d2" : "1px solid #ccc",
                boxShadow: selectedPlan === plan.id ? 6 : 2,
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {plan.price}
                </Typography>
                <List>
                  {plan.benefits.map((benefit, i) => (
                    <ListItem key={i} sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
                      <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">{benefit}</Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleProceed}
          disabled={!selectedPlan}
        >
          Proceed to Payment
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}

export default MembershipPage;
