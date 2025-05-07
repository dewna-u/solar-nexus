// HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  SolarPower as SolarPowerIcon,
  Power as EnergyIcon,
  AccountTree as SystemsIcon,
  MonetizationOn as EarningsIcon,      // ← make sure this is imported
  HourglassEmpty as UptimeIcon,
  WorkspacePremium as MembershipIcon,
} from "@mui/icons-material";

export default function HomePage() {
  const navigate = useNavigate();

  // Example KPI data (replace with your real data)
  const userName = "Jane Doe";
  const kpis = {
    energyToday: 42.7,    // kWh
    activeSystems: 3,     // count
    earnings: 12.3,       // in thousands $
    uptime: 99.8,         // %
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Welcome */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {userName}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here’s a quick glance at your solar portfolio
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        {/* Energy Produced */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: "center" }}>
              <EnergyIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={1}>
                Energy Produced
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {kpis.energyToday} kWh
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Systems */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: "center" }}>
              <SystemsIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={1}>
                Active Systems
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {kpis.activeSystems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: "center" }}>
              <EarningsIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={1}>
                Earnings
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ${kpis.earnings}k
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* System Uptime */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: "center" }}>
              <UptimeIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={1}>
                System Uptime
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {kpis.uptime}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SolarPowerIcon />}
            onClick={() => navigate("/SolarInputs")}
          >
            Add Solar Inputs
          </Button>
          <Button
            variant="contained"
            startIcon={<EnergyIcon />}
            onClick={() => navigate("/MonitoringDashboard")}
          >
            View Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<EarningsIcon />}
            onClick={() => navigate("/PaymentPage")}
          >
            Payment Page
          </Button>
          <Button
            variant="outlined"
            startIcon={<MembershipIcon />}
            onClick={() => navigate("/MembershipPage")}
          >
            Membership
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
