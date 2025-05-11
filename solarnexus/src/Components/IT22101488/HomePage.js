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
  MonetizationOn as EarningsIcon,
  HourglassEmpty as UptimeIcon,
  WorkspacePremium as MembershipIcon,
} from "@mui/icons-material";

export default function HomePage() {
  const navigate = useNavigate();

  // Example KPI data (replace with your real data)
  const userName = "Jane Doe";
  const kpis = {
    energyToday: 42.7, // kWh
    activeSystems: 3, // count
    earnings: 12.3, // in thousands $
    uptime: 99.8, // %
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Welcome */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {userName}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here’s a quick glance at your solar portfolio
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={4}>
        {/* Energy Produced */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              textAlign: "center",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <EnergyIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={2}>
                Energy Produced
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {kpis.energyToday} kWh
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Systems */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              textAlign: "center",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <SystemsIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={2}>
                Active Systems
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {kpis.activeSystems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              textAlign: "center",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <EarningsIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={2}>
                Earnings
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                ${kpis.earnings}k
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* System Uptime */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              textAlign: "center",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <UptimeIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={2}>
                System Uptime
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {kpis.uptime}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Quick Actions
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 3,
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            startIcon={<SolarPowerIcon />}
            onClick={() => navigate("/SolarInputs")}
            sx={{ px: 4, py: 1.5 }}
          >
            Add Solar Inputs
          </Button>
          <Button
            variant="contained"
            startIcon={<EnergyIcon />}
            onClick={() => navigate("/MonitoringDashboard")}
            sx={{ px: 4, py: 1.5 }}
          >
            View Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<EarningsIcon />}
            onClick={() => navigate("/PaymentPage")}
            sx={{ px: 4, py: 1.5 }}
          >
            Payment Page
          </Button>
          <Button
            variant="outlined"
            startIcon={<MembershipIcon />}
            onClick={() => navigate("/MembershipPage")}
            sx={{ px: 4, py: 1.5 }}
          >
            Membership
          </Button>
        </Box>
      </Box>
    </Container>
  );
}