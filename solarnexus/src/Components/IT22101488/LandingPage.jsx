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
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
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
            <Button
              component={RouterLink}
              to="/login"
              sx={{ marginRight: 2 }}
            >
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
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
          color: "#fff",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            Monitor Your Solar Power—Effortlessly
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Track real-time output, forecast future energy, and optimize
            performance—all in one dashboard.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/register"
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              {
                icon: <SolarPower color="primary" sx={{ fontSize: 40 }} />,
                title: "Real-Time Monitoring",
                text: "See exactly how much power your panels are producing right now.",
              },
              {
                icon: <InsertChart color="primary" sx={{ fontSize: 40 }} />,
                title: "Accurate Forecasts",
                text: "Plan ahead with AI-driven energy generation predictions.",
              },
              {
                icon: <Speed color="primary" sx={{ fontSize: 40 }} />,
                title: "Performance Insights",
                text: "Identify underperforming panels and boost efficiency.",
              },
            ].map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  elevation={3}
                  sx={{ 
                    textAlign: "center", 
                    py: 4, 
                    px: 2, 
                    height: "100%" 
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 64,
                      height: 64,
                      margin: "0 auto 16px",
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.text}
                    </Typography>
                  </CardContent>
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
          py: 3,
          mt: 6,
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
