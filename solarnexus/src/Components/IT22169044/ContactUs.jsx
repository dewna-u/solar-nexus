import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box
} from '@mui/material';

const ContactUs = () => {
  const [contactMethod, setContactMethod] = useState('phone'); // Default to phone

  const handleContactMethodChange = (method) => {
    setContactMethod(method);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Contact Us
      </Typography>
      <Typography variant="body1" align="center" mb={3}>
        If you have any questions or inquiries, feel free to reach out using the options below.
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} marginBottom={3}>
        <Button
          variant={contactMethod === 'phone' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleContactMethodChange('phone')}
        >
          Call Us
        </Button>
        <Button
          variant={contactMethod === 'gmail' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleContactMethodChange('gmail')}
        >
          Email Us
        </Button>
      </Box>

      {contactMethod === 'phone' && (
        <Box textAlign="center">
          <Typography variant="h6">
            <strong>Phone:</strong>{' '}
            <a href="tel:0112345678">011 234 5678</a>
          </Typography>
        </Box>
      )}

      {contactMethod === 'gmail' && (
        <Box textAlign="center">
          <Typography variant="h6">
            <strong>Email:</strong>{' '}
            <a href="mailto:solarnexcusofficial@gmail.com">solarnexcusofficial@gmail.com</a>
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ContactUs;