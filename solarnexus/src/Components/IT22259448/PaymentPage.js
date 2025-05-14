"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
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
  Grid,
  Modal,
  Fade,
  Backdrop,
  Card,
  CardContent,
  Divider,
  Container,
  Stack,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import PaymentIcon from "@mui/icons-material/Payment"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LockIcon from "@mui/icons-material/Lock"

function PaymentPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()
  const navigate = useNavigate()
  const selectedPlan = location.state

  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })
  const [errors, setErrors] = useState({})
  const [successOpen, setSuccessOpen] = useState(false)

  useEffect(() => {
    if (selectedPlan && selectedPlan.amount) {
      setFormData((prev) => ({ ...prev, amount: selectedPlan.amount }))
    }
  }, [selectedPlan])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Full Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!formData.email.includes("@")) newErrors.email = "Email must contain '@' sign"
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0)
      newErrors.amount = "Valid amount is required"

    if (paymentMethod === "credit") {
      if (!/^[0-9]{16}$/.test(formData.cardNumber)) newErrors.cardNumber = "Card number must be 16 digits"
      if (!formData.expiry) newErrors.expiry = "Expiry date is required"
      if (!/^[0-9]{3}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, paymentMethod }),
        })

        const data = await response.json()
        if (response.ok) {
          setSuccessOpen(true)
          setTimeout(() => {
            navigate("/SolarInputs")
          }, 2500)
        } else {
          alert("Payment failed: " + data.message)
        }
      } catch (error) {
        alert("Network error. Payment not processed.")
        console.error("Payment error:", error)
      }
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/solar-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 5,
      }}
    >
      <Container maxWidth="md">
        <Stepper
          activeStep={1}
          alternativeLabel
          sx={{
            mb: 4,
            display: { xs: "none", sm: "flex" },
            "& .MuiStepLabel-label": {
              color: "white",
            },
            "& .MuiStepIcon-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: theme.palette.success.main,
            },
          }}
        >
          <Step>
            <StepLabel>Select Plan</StepLabel>
          </Step>
          <Step>
            <StepLabel>Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel>Solar Setup</StepLabel>
          </Step>
        </Stepper>

        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Grid container>
            {/* Left side - colored panel */}
            <Grid
              item
              xs={0}
              md={4}
              sx={{
                bgcolor: theme.palette.primary.main,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
                color: "white",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <PaymentIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Secure Payment
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  Your transaction is secured with SSL encryption
                </Typography>

                <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Accepted Payment Methods
                  </Typography>
                  <Box display="flex" gap={1} mt={1} justifyContent="center" flexWrap="wrap">
                    <img src="/visa.png" alt="Visa" width={40} />
                    <img src="/mastercard.png" alt="MasterCard" width={40} />
                    <img src="/amex.png" alt="AmEx" width={40} />
                    <img src="/paypal.png" alt="PayPal" width={40} />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right side - form */}
            <Grid item xs={12} md={8}>
              <Box sx={{ p: { xs: 3, sm: 4 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h5" fontWeight="bold">
                    Complete Your Payment
                  </Typography>
                  <Box
                    sx={{
                      display: { xs: "flex", md: "none" },
                      gap: 1,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <img src="/visa.png" alt="Visa" width={30} />
                    <img src="/mastercard.png" alt="MasterCard" width={30} />
                    <img src="/amex.png" alt="AmEx" width={30} />
                  </Box>
                </Box>

                <form onSubmit={handlePaymentSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Amount (LKR)"
                        name="amount"
                        value={formData.amount}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <Typography sx={{ mr: 1 }}>LKR</Typography>,
                        }}
                        error={!!errors.amount}
                        helperText={errors.amount}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  <Box mt={3}>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel component="legend" sx={{ mb: 2 }}>
                        Payment Method
                      </FormLabel>
                      <RadioGroup
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            mb: 2,
                            border:
                              paymentMethod === "credit"
                                ? `2px solid ${theme.palette.primary.main}`
                                : "1px solid rgba(0,0,0,0.12)",
                            borderRadius: 2,
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <FormControlLabel
                              value="credit"
                              control={<Radio />}
                              label={
                                <Box display="flex" alignItems="center">
                                  <CreditCardIcon sx={{ mr: 1 }} />
                                  <Typography>Credit/Debit Card</Typography>
                                </Box>
                              }
                            />
                          </CardContent>
                        </Card>
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {paymentMethod === "credit" && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        margin="normal"
                        variant="outlined"
                        placeholder="1234 5678 9012 3456"
                      />
                      <Grid container spacing={2} sx={{ mt: 0 }}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Expiry Date"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            error={!!errors.expiry}
                            helperText={errors.expiry}
                            margin="normal"
                            variant="outlined"
                            placeholder="MM/YY"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="CVV"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            error={!!errors.cvv}
                            helperText={errors.cvv}
                            margin="normal"
                            variant="outlined"
                            placeholder="123"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <Box sx={{ mt: 4 }}>
                    <Stack spacing={2}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<LockIcon />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        Pay Now {formData.amount ? `(LKR ${formData.amount})` : ""}
                      </Button>

                      <Button
                        variant="text"
                        color="inherit"
                        onClick={() => navigate("/MembershipPage")}
                        startIcon={<ArrowBackIcon />}
                        sx={{ textTransform: "none" }}
                      >
                        Back to Membership
                      </Button>
                    </Stack>

                    <Box sx={{ mt: 3, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                      <LockIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Your payment information is secure and encrypted
                      </Typography>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Success Modal */}
      <Modal open={successOpen} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
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
              Redirecting to Solar Setup...
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

export default PaymentPage
