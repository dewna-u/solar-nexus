import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "rgba(50, 50, 50, 0.8)", // Semi-transparent dark background
        color: "#fff",
        px: { xs: 4, sm: 8 },
        py: { xs: 6, sm: 8 },
        mt: "auto",
        borderRadius: "12px", // Rounded edges
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Shadow outline
        backdropFilter: "blur(10px)", // Blur effect
        mx: { xs: 2, sm: 4 }, // Margin on the sides
      }}
    >
      <Grid container spacing={4}>
        {/* Branding Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Solar Nexus
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            A smart solar monitoring solution to track, optimize, and improve your energy usage for a greener tomorrow.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            <Link href="/HomePage" color="inherit" underline="hover">
              Home
            </Link>
            <Link href="/MonitoringDashboard" color="inherit" underline="hover">
              Monitoring
            </Link>
            <Link href="/Contact" color="inherit" underline="hover">
              Contact
            </Link>
            <Link href="/About" color="inherit" underline="hover">
              About Us
            </Link>
            <Link href="/PrivacyPolicy" color="inherit" underline="hover">
              Privacy Policy
            </Link>
            <Link href="/Terms" color="inherit" underline="hover">
              Terms of Service
            </Link>
          </Stack>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <EmailIcon fontSize="small" />
            <Typography variant="body2">solarnexusofficial@gmail.com</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">+91 98765 43210</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">Chennai, India</Typography>
          </Stack>
        </Grid>

        {/* Social Media */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton color="inherit" href="https://facebook.com" target="_blank">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="https://twitter.com" target="_blank">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" href="https://wa.me/1234567890" target="_blank">
              <WhatsAppIcon />
            </IconButton>
            <IconButton color="inherit" href="https://instagram.com" target="_blank">
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>

      {/* Divider and Bottom Note */}
      <Divider sx={{ bgcolor: "#444", my: 4 }} />
      <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
        © {new Date().getFullYear()} Solar Nexus. All rights reserved.
      </Typography>
      <Typography variant="body2" align="center" sx={{ opacity: 0.7, mt: 1 }}>
        Designed and developed with ❤️ by Solar Nexus Team.
      </Typography>
    </Box>
  );
};

export default Footer;