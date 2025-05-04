import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = async () => {
    if (!selectedPlan) return;
    const selectedPlanData = membershipPlans.find((plan) => plan.id === selectedPlan);

    console.log("Submitting membership plan:", selectedPlanData);

    try {
      const response = await fetch("http://localhost:5000/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlanData),
      });

      if (response.ok) {
        console.log("Membership plan submitted successfully!");
      } else {
        alert("Failed to submit membership plan.");
      }
    } catch (error) {
      console.error("Error submitting membership:", error);
      alert("An error occurred while submitting.");
    }
  };

  const handleProceed = async () => {
    const selectedPlanData = membershipPlans.find((plan) => plan.id === selectedPlan);
    console.log("Selected Plan:", selectedPlanData);
    await handleSubmit();
    navigate("/PaymentPage", { state: selectedPlanData });
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
                '&:hover': { boxShadow: 6 },
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
                  {plan.benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
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
