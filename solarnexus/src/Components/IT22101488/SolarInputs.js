
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk"
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  createTheme,
  ThemeProvider,
  Tooltip,
  Divider,
  Chip,
  Stack,
  Fade,
  LinearProgress,
} from "@mui/material"
import {
  SolarPower,
  Speed,
  LocationOn,
  Send,
  Dashboard,
  Mic,
  Info,
  WbSunny,
  BarChart,
  EmojiObjects,
} from "@mui/icons-material"

// 🔑 Replace with your Azure Speech credentials
const AZURE_KEY = "EhqxXUnQrtNIaA5JUeccg9W7Unw8OF7D3fbauRsuYtLVtWZYNeGEJQQJ99BEACYeBjFXJ3w3AAAYACOGRNWk"
const AZURE_REGION = "eastus"

const sriLankaDistricts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
]

const matchDistrict = (sentence) => {
  const lower = sentence.toLowerCase()
  return sriLankaDistricts.find((d) => lower.includes(d.toLowerCase())) || ""
}

const recognizeSpeech = () => {
  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION)
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)

    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        resolve(result.text)
      } else {
        reject("Speech not recognized")
      }
    })
  })
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    secondary: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#03a9f4",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "10px 24px",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #2e7d32 30%, #43a047 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #f57c00 30%, #ff9800 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          overflow: "visible",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
})

function SolarInputs() {
  const [formData, setFormData] = useState({
    numPanels: "",
    panelCapacity: "",
    location: "",
  })
  const [recognizedText, setRecognizedText] = useState("")
  const [error, setError] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      numPanels: Number.parseInt(formData.numPanels),
      panelCapacity: Number.parseFloat(formData.panelCapacity),
      location: formData.location,
    }

    const token = localStorage.getItem("token")

    try {
      const response = await axios.post("http://localhost:5000/api/solarInputs/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 201) {
        navigate("/MonitoringDashboard", {
          state: { weatherData: response.data.data.weather },
        })
      }
    } catch (error) {
      setError(error.response?.data?.message || "Submission failed")
      setShowAlert(true)
      setIsSubmitting(false)
    }
  }

  const handleVoiceInput = async () => {
    try {
      setIsListening(true)
      const speechText = await recognizeSpeech()
      setRecognizedText(speechText)
      console.log("🗣 Detected:", speechText)

      const numPanelsMatch = speechText.match(/(\d+)\s*panels?/i)
      const capacityMatch = speechText.match(/each\s*(\d+(\.\d+)?)/i) || speechText.match(/(\d+(\.\d+)?)\s*k?w/i) // fallback match like "1 kW"
      const location = matchDistrict(speechText)
      

      const numPanels = numPanelsMatch ? numPanelsMatch[1] : ""
      const panelCapacity = capacityMatch ? capacityMatch[1] : ""

      setFormData({
        numPanels,
        panelCapacity,
        location,
      })
    } catch (err) {
      setError("Voice input failed")
      setShowAlert(true)
    } finally {
      setIsListening(false)
    }
  }

  // Calculate estimated power output
  const estimatedOutput =
    formData.numPanels && formData.panelCapacity
      ? (Number.parseFloat(formData.numPanels) * Number.parseFloat(formData.panelCapacity)).toFixed(2)
      : null

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          background: "linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ position: "relative", mb: 8 }}>
            <Card
              elevation={8}
              sx={{
                position: "relative",
                overflow: "visible",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -20,
                  left: -20,
                  right: -20,
                  bottom: -20,
                  background: "radial-gradient(circle at top left, rgba(255,235,59,0.2), transparent 70%)",
                  zIndex: -1,
                  borderRadius: "24px",
                },
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <WbSunny
                      sx={{
                        fontSize: 40,
                        color: "secondary.main",
                        mr: 2,
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }}
                    />
                    <Typography variant="h4" color="primary.dark" sx={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                      Solar Panel Configuration
                    </Typography>
                  </Box>
                }
                subheader={
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Chip
                      icon={<EmojiObjects fontSize="small" />}
                      label="Voice Enabled"
                      color="secondary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Try saying: "I have 52 panels each 1 kilowatt at Colombo"
                    </Typography>
                  </Box>
                }
                sx={{ pb: 0 }}
              />

              {recognizedText && (
                <Fade in={!!recognizedText}>
                  <Box
                    sx={{
                      mx: 3,
                      my: 2,
                      p: 2,
                      backgroundColor: "rgba(255, 253, 231, 0.8)",
                      borderRadius: 2,
                      border: "1px solid #fff9c4",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Mic fontSize="small" sx={{ mr: 1, color: "secondary.main" }} />
                      Recognized:{" "}
                      <Box component="span" sx={{ ml: 1, fontWeight: 600, color: "text.primary" }}>
                        {recognizedText}
                      </Box>
                    </Typography>
                  </Box>
                </Fade>
              )}

              <CardContent sx={{ pt: 3 }}>
                {isListening && (
                  <Box sx={{ width: "100%", mb: 3 }}>
                    <LinearProgress color="secondary" />
                    <Typography variant="caption" align="center" display="block" sx={{ mt: 1 }}>
                      Listening...
                    </Typography>
                  </Box>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Number of Solar Panels"
                        name="numPanels"
                        type="number"
                        value={formData.numPanels}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        helperText="Total number of panels in your installation"
                        InputProps={{
                          startAdornment: <SolarPower sx={{ color: "primary.light", mr: 1 }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Panel Capacity (kW)"
                        name="panelCapacity"
                        type="number"
                        value={formData.panelCapacity}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        helperText="Power rating of each panel in kilowatts"
                        InputProps={{
                          startAdornment: <Speed sx={{ color: "primary.light", mr: 1 }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>District in Sri Lanka</InputLabel>
                        <Select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          label="District in Sri Lanka"
                          startAdornment={<LocationOn sx={{ color: "primary.light", mr: 1 }} />}
                        >
                          <MenuItem value="" disabled>
                            <em>Select a district</em>
                          </MenuItem>
                          {sriLankaDistricts.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {estimatedOutput && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 4,
                        p: 2,
                        bgcolor: "rgba(76, 175, 80, 0.08)",
                        borderRadius: 2,
                        border: "1px solid rgba(76, 175, 80, 0.2)",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <BarChart color="success" />
                        <Typography variant="subtitle1">
                          Estimated System Capacity: <strong>{estimatedOutput} kW</strong>
                        </Typography>
                      </Stack>
                    </Paper>
                  )}

                  <Divider sx={{ my: 4 }} />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<Dashboard />}
                      onClick={() => navigate("/MonitoringDashboard")}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Go to Dashboard
                    </Button>

                    <Stack direction="row" spacing={2}>
                      <Tooltip title="Use voice input to fill the form">
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleVoiceInput}
                          disabled={isListening}
                          startIcon={<Mic />}
                        >
                          Voice Input
                        </Button>
                      </Tooltip>

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<Send />}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Configuration"}
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </CardContent>
            </Card>

            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                top: -15,
                right: -15,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,193,7,0.2) 0%, rgba(255,193,7,0) 70%)",
                zIndex: -1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -20,
                left: "30%",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0) 70%)",
                zIndex: -1,
              }}
            />
          </Box>

          <Paper
            elevation={2}
            sx={{
              p: 3,
              bgcolor: "rgba(255,255,255,0.9)",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Info color="info" />
              <Typography variant="body2">
                This system calculates solar energy forecasts based on your panel configuration and local weather data
                for your selected district in Sri Lanka.
              </Typography>
            </Stack>
          </Paper>

          <Snackbar
            open={showAlert}
            autoHideDuration={5000}
            onClose={() => setShowAlert(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert severity="error" variant="filled" sx={{ width: "100%" }} onClose={() => setShowAlert(false)}>
              {error}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default SolarInputs