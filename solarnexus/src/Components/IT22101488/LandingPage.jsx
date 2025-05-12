// src/pages/LandingPage.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  useTheme,
} from "@mui/material";
import { SolarPower, Speed, InsertChart } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPage() {
  const theme = useTheme();

  return (
    <Box>
      {/* NAVBAR */}
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            SolarNexus
          </Typography>
          <Box>
            <Button component={RouterLink} to="/login" sx={{ mr: 2 }}>
              Login
            </Button>
            <Button
              variant="contained"
              component={RouterLink}
              to="/register"
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          backgroundImage:
            "linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/images/solar-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          py: 10,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            Monitor Your Solar Power
            <br />
            Effortlessly
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              lineHeight: 1.5,
            }}
          >
            Track real-time output, forecast future energy, and optimize
            performance—all in one dashboard.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1rem",
              boxShadow: theme.shadows[4],
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box sx={{ py: 8, background: theme.palette.grey[50] }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {[
              {
                icon: <SolarPower fontSize="large" />,
                title: "Real-Time Monitoring",
                text: "See exactly how much power your panels are producing right now.",
              },
              {
                icon: <InsertChart fontSize="large" />,
                title: "Accurate Forecasts",
                text: "Plan ahead with AI-driven energy generation predictions.",
              },
              {
                icon: <Speed fontSize="large" />,
                title: "Performance Insights",
                text: "Identify underperforming panels and boost efficiency.",
              },
            ].map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 4,
                    "&:hover": { transform: "translateY(-4px)" },
                    transition: "transform 0.3s ease",
                  }}
                >
                  <CardActionArea>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        pt: 4,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          width: 64,
                          height: 64,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </Box>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.text}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: "center",
          background: theme.palette.grey[100],
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} SolarNexus. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
