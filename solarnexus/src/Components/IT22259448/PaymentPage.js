import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  Paper,
  Alert,
  Grid,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state;

  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (selectedPlan && selectedPlan.amount) {
      setFormData((prev) => ({ ...prev, amount: selectedPlan.amount }));
    }
  }, [selectedPlan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!formData.email.includes("@")) newErrors.email = "Email must contain '@' sign";
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0)
      newErrors.amount = "Valid amount is required";

    if (paymentMethod === "credit") {
      if (!/^[0-9]{12}$/.test(formData.cardNumber))
        newErrors.cardNumber = "Card number must be 12 digits";
      if (!formData.expiry) newErrors.expiry = "Expiry date is required";
      if (!/^[0-9]{3}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, paymentMethod }),
        });

        const data = await response.json();
        if (response.ok) {
          setSuccessOpen(true);
          setTimeout(() => {
            navigate("/SolarInputs");
          }, 2500);
        } else {
          alert("Payment failed: " + data.message);
        }
      } catch (error) {
        alert("Network error. Payment not processed.");
        console.error("Payment error:", error);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url('/solar-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 600, backdropFilter: "blur(10px)" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Complete Your Payment
          </Typography>

          <Box display="flex" gap={2} my={2}>
            <img src="/paypal.png" alt="PayPal" width={50} />
            <img src="/visa.png" alt="Visa" width={50} />
            <img src="/mastercard.png" alt="MasterCard" width={50} />
            <img src="/amex.png" alt="AmEx" width={50} />
          </Box>

          <form onSubmit={handlePaymentSubmit} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Amount (LKR)"
              name="amount"
              value={formData.amount}
              margin="normal"
              InputProps={{ readOnly: true }}
              error={!!errors.amount}
              helperText={errors.amount}
            />

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                row
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel value="credit" control={<Radio />} label="Credit/Debit Card" />
                
              </RadioGroup>
            </FormControl>

            {paymentMethod === "credit" && (
              <Box>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  margin="normal"
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date (MM/YY)"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      margin="normal"
                      error={!!errors.expiry}
                      helperText={errors.expiry}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      margin="normal"
                      error={!!errors.cvv}
                      helperText={errors.cvv}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              startIcon={<PaymentIcon />}
            >
              Pay Now
            </Button>
          </form>

          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate("/MembershipPage")}
            sx={{ mt: 2 }}
          >
            Back to Membership
          </Button>
        </Paper>
      </Box>

      {/* ✅ Success Modal */}
      <Modal
        open={successOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={successOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
              width: 300,
            }}
          >
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold">
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Redirecting...
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default PaymentPage;
