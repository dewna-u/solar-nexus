// src/components/MembershipPage.jsx

import React, { useState, useEffect } from "react";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [changePlanMessage, setChangePlanMessage] = useState("");
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
      price: "LKR 33,000",
      amount: 33000,
      benefits: ["One month free", "Cancel anytime", "One-time payment"],
    },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/MembershipPage" } });
    }
  }, [navigate]);

  // Fetch current membership status
  useEffect(() => {
    const fetchCurrentMembership = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/membership/current",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // User has an existing membership
        setCurrentMembership({
          id: data.id,
          name: data.name,
          price: data.price,
          amount: data.amount,
          status: data.status || "Active",
        });
        if (data.id !== "free") {
          setSelectedPlan(data.id);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // No membership yet
          setCurrentMembership(null);
        } else if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setError("Failed to load your current membership");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMembership();
  }, []);

  // Submit a brand-new membership (used if you call this after payment succeeds)
  const handleSubmit = async () => {
    if (!selectedPlan) return;
    const planData = membershipPlans.find((p) => p.id === selectedPlan);
    const token = localStorage.getItem("token");

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

      if (response.status === 200 || response.status === 201) {
        setChangePlanMessage("Membership plan submitted successfully!");
        setShowDialog(true);
        // Optionally refresh currentMembership here...
      } else {
        console.error("Unexpected status:", response.status);
        alert("Failed to submit membership plan.");
      }
    } catch (err) {
      console.error("Error submitting membership:", err);
      alert("An error occurred while submitting.");
    }
  };

  // Decide whether to navigate to payment or call change endpoint
  const handleProceed = async () => {
    if (!selectedPlan) return;
    const selectedPlanData = membershipPlans.find(
      (plan) => plan.id === selectedPlan
    );

    // If no existing membership, go pay first
    if (!currentMembership) {
      localStorage.setItem("pendingMembership", selectedPlan);
      navigate("/PaymentPage", { state: selectedPlanData });
      return;
    }

    // Same plan: nothing to do
    if (currentMembership.id === selectedPlan) {
      setChangePlanMessage("You are already subscribed to this plan.");
      setShowDialog(true);
      return;
    }

    // Compare plan "tiers"
    const currentIndex = membershipPlans.findIndex(
      (p) => p.id === currentMembership.id
    );
    const newIndex = membershipPlans.findIndex(
      (p) => p.id === selectedPlan
    );

    // Upgrading: go pay
    if (newIndex > currentIndex) {
      localStorage.setItem("pendingMembership", selectedPlan);
      navigate("/PaymentPage", { state: selectedPlanData });
      return;
    }

    // Downgrading: call change endpoint directly
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/membership/change",
        { newPlanId: selectedPlan },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setChangePlanMessage("Your membership has been changed successfully!");
        setCurrentMembership({
          ...currentMembership,
          id: selectedPlanData.id,
          name: selectedPlanData.name,
          price: selectedPlanData.price,
          amount: selectedPlanData.amount,
        });
      } else {
        setChangePlanMessage(
          `Failed to change your membership plan: ${response.statusText}`
        );
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setChangePlanMessage("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login", { state: { from: "/MembershipPage" } });
        }, 2000);
      } else {
        console.error("Error changing membership:", err);
        setChangePlanMessage("An error occurred while changing your plan.");
      }
    } finally {
      setShowDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
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

      {loading ? (
        <Typography>Loading your membership information...</Typography>
      ) : error ? (
        <Alert
          severity="error"
          sx={{ mb: 2, width: "80%", maxWidth: "600px" }}
          action={
            error.includes("expired") && (
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )
          }
        >
          {error}
        </Alert>
      ) : (
        <>
          {currentMembership && (
            <Alert
              severity={
                currentMembership.id === "free" ? "info" : "success"
              }
              sx={{ mb: 3, width: "80%", maxWidth: "600px" }}
            >
              {currentMembership.id === "free"
                ? "You are currently on a Free plan. Select a membership plan below to upgrade."
                : `You are currently subscribed to the ${currentMembership.name} plan. ${
                    currentMembership.status === "Active"
                      ? "Select another plan below to change your subscription."
                      : "Your subscription has been cancelled."
                  }`}
            </Alert>
          )}

          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
          >
            {currentMembership
              ? "Change your membership plan:"
              : "Select a membership plan to continue:"}
          </Typography>

          <Grid
            container
            spacing={3}
            justifyContent="center"
            mt={2}
            mb={4}
            maxWidth="md"
          >
            {membershipPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Card
                  onClick={() => setSelectedPlan(plan.id)}
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedPlan === plan.id
                        ? "2px solid #1976d2"
                        : currentMembership &&
                          currentMembership.id === plan.id
                        ? "2px solid #28a745"
                        : "1px solid #ccc",
                    boxShadow: selectedPlan === plan.id ? 6 : 2,
                    transition: "all 0.3s ease",
                    "&:hover": { boxShadow: 6 },
                    position: "relative",
                  }}
                >
                  {currentMembership &&
                    currentMembership.id === plan.id && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          bgcolor: "#28a745",
                          color: "white",
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        Current Plan
                      </Box>
                    )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      fontWeight="bold"
                    >
                      {plan.price}
                    </Typography>
                    <List>
                      {plan.benefits.map((benefit, idx) => (
                        <ListItem
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 0.5,
                          }}
                        >
                          <CheckCircleIcon
                            fontSize="small"
                            color="success"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">
                            {benefit}
                          </Typography>
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
              {currentMembership ? "Change Plan" : "Proceed to Payment"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </Box>
        </>
      )}

      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>Membership Update</DialogTitle>
        <DialogContent>
          <Typography>{changePlanMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MembershipPage;
