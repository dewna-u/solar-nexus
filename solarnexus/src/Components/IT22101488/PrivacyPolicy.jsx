import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Privacy Policy
      </Typography>

      <Typography variant="body1" paragraph>
        At <strong>Solar Nexus</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our platform.
      </Typography>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>1. Information We Collect</Typography>
        <Typography variant="body2" paragraph>
          - Personal details (name, email, phone) provided during registration or contact.<br />
          - Solar input data, location, and preferences submitted by users.<br />
          - Technical information like IP address, browser type, and device info.
        </Typography>

        <Typography variant="h6" gutterBottom>2. How We Use Your Information</Typography>
        <Typography variant="body2" paragraph>
          - To provide solar monitoring and forecasting services.<br />
          - To process membership and payments securely.<br />
          - To respond to inquiries, feedback, or support requests.<br />
          - To send important updates or service-related communication.
        </Typography>

        <Typography variant="h6" gutterBottom>3. Data Sharing</Typography>
        <Typography variant="body2" paragraph>
          We do not sell or rent your personal information. Data may be shared with trusted partners only to support essential services (e.g., payment gateways, email services).
        </Typography>

        <Typography variant="h6" gutterBottom>4. Data Security</Typography>
        <Typography variant="body2" paragraph>
          We implement strong security measures to safeguard your data from unauthorized access, disclosure, or misuse.
        </Typography>

        <Typography variant="h6" gutterBottom>5. Cookies and Tracking</Typography>
        <Typography variant="body2" paragraph>
          Our website may use cookies to improve your experience, track usage, and remember your preferences.
        </Typography>

        <Typography variant="h6" gutterBottom>6. Your Rights</Typography>
        <Typography variant="body2" paragraph>
          You have the right to access, correct, or delete your data at any time. Contact us at <strong>solarnexusofficial@gmail.com</strong> for any requests.
        </Typography>

        <Typography variant="h6" gutterBottom>7. Updates to This Policy</Typography>
        <Typography variant="body2" paragraph>
          We may update this policy from time to time. Changes will be reflected on this page with a revised "Last Updated" date.
        </Typography>

        <Typography variant="h6" gutterBottom>8. Contact Us</Typography>
        <Typography variant="body2" paragraph>
          If you have any questions about this Privacy Policy, reach out to us at <strong>solarnexusofficial@gmail.com</strong>.
        </Typography>

        <Typography variant="body2" sx={{ mt: 3, fontStyle: "italic" }}>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
