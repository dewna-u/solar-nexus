import React, { useState, useEffect } from "react";
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
      price: "LKR 33000",
      amount: 33000,
      benefits: ["One month free", "Cancel anytime", "One-time payment"],
    },
  ];

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if no token found
      navigate('/login', { state: { from: '/MembershipPage' } });
    }
  }, [navigate]);

  // Fetch current membership when component mounts
  useEffect(() => {
    const fetchCurrentMembership = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return; // No logged in user
        }
        
        // Fetch user's current membership
        const response = await fetch("http://localhost:5000/api/membership/current", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const membershipData = await response.json();
          console.log("Membership data:", membershipData); // Debug log
          
          // Handle any valid plan including free
          if (membershipData.id) {
            // Set current membership from API response
            setCurrentMembership({
              id: membershipData.id,
              name: membershipData.name,
              price: membershipData.price,
              amount: membershipData.amount,
              status: membershipData.status || "Active"
            });
            
            // Only pre-select if it's a paid plan, not free
            if (membershipData.id !== "free") {
              setSelectedPlan(membershipData.id);
            }
          }
        } else {
          console.error("Failed to fetch membership data:", response.status);
          // If unauthorized, possibly redirect to login
          if (response.status === 401) {
            setError("Your session has expired. Please log in again.");
            localStorage.removeItem('token'); // Clear invalid token
          } else {
            setError("Failed to load your membership details.");
          }
        }
      } catch (err) {
        console.error("Error fetching current membership:", err);
        setError("Failed to load your current membership");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMembership();
  }, []);

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
    if (!selectedPlan) return;
    
    const selectedPlanData = membershipPlans.find((plan) => plan.id === selectedPlan);
    console.log("Selected Plan:", selectedPlanData);

    // If no current membership, proceed to payment
    if (!currentMembership) {
      // Store the selected plan temporarily in localStorage for after payment
      localStorage.setItem('pendingMembership', selectedPlan);
      navigate("/PaymentPage", { state: selectedPlanData });
      return;
    }

    // Handle plan changes
    if (currentMembership.id === selectedPlan) {
      // No change in plan
      setChangePlanMessage("You are already subscribed to this plan.");
      setShowDialog(true);
      return;
    }

    // Determine if payment is needed
    const currentPlanIndex = membershipPlans.findIndex(plan => plan.id === currentMembership.id);
    const newPlanIndex = membershipPlans.findIndex(plan => plan.id === selectedPlan);
    
    // If upgrading to a more expensive plan (weekly -> monthly, weekly -> yearly, monthly -> yearly)
    if (newPlanIndex > currentPlanIndex) {
      // Store the selected plan temporarily in localStorage for after payment
      localStorage.setItem('pendingMembership', selectedPlan);
      navigate("/PaymentPage", { state: selectedPlanData });
    } else {
      // Downgrading plan (monthly -> weekly, yearly -> monthly, yearly -> weekly)
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("You need to be logged in to change your membership plan.");
          return;
        }
        
        const response = await fetch("http://localhost:5000/api/membership/change", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            newPlanId: selectedPlan
          }),
        });

        if (response.ok) {
          setChangePlanMessage("Your membership has been changed successfully!");
          setShowDialog(true);
          // Update current membership
          setCurrentMembership({
            ...currentMembership,
            id: selectedPlanData.id,
            name: selectedPlanData.name,
            price: selectedPlanData.price,
            amount: selectedPlanData.amount
          });
        } else {
          if (response.status === 401) {
            setChangePlanMessage("Your session has expired. Please log in again.");
            localStorage.removeItem('token'); // Clear invalid token
            setTimeout(() => {
              navigate('/login', { state: { from: '/MembershipPage' } });
            }, 2000);
          } else {
            const errorData = await response.json();
            setChangePlanMessage(`Failed to change your membership plan: ${errorData.message}`);
          }
          setShowDialog(true);
        }
      } catch (error) {
        console.error("Error changing membership:", error);
        setChangePlanMessage("An error occurred while changing your plan.");
        setShowDialog(true);
      }
    }
  };

  // Dialog close handler
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
            error.includes("session has expired") && (
              <Button color="inherit" size="small" onClick={() => navigate('/login')}>
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
              severity={currentMembership.id === "free" ? "info" : "success"} 
              sx={{ mb: 3, width: "80%", maxWidth: "600px" }}
            >
              {currentMembership.id === "free" 
                ? "You are currently on a Free plan. Select a membership plan below to upgrade."
                : `You are currently subscribed to the ${currentMembership.name} plan. 
                   ${currentMembership.status === "Active" ? "Select another plan below to change your subscription." : "Your subscription has been cancelled."}`
              }
            </Alert>
          )}
          
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {currentMembership ? "Change your membership plan:" : "Select a membership plan to continue:"}
          </Typography>

          <Grid container spacing={3} justifyContent="center" mt={2} mb={4} maxWidth="md">
            {membershipPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Card
                  onClick={() => setSelectedPlan(plan.id)}
                  sx={{
                    cursor: "pointer",
                    border: selectedPlan === plan.id ? "2px solid #1976d2" : 
                           (currentMembership && currentMembership.id === plan.id) ? 
                           "2px solid #28a745" : "1px solid #ccc",
                    boxShadow: selectedPlan === plan.id ? 6 : 2,
                    transition: "all 0.3s ease",
                    '&:hover': { boxShadow: 6 },
                    position: "relative",
                  }}
                >
                  {currentMembership && currentMembership.id === plan.id && (
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
              {currentMembership ? "Change Plan" : "Proceed to Payment"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </Box>
        </>
      )}

      {/* Dialog for plan change confirmation */}
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Membership Update</DialogTitle>
        <DialogContent>
          <Typography>{changePlanMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MembershipPage;

