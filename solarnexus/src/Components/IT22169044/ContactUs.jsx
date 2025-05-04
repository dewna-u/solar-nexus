import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMethod, setContactMethod] = useState('form'); // Default is the form
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactMethodChange = (method) => {
    setContactMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'Server error. Please try again later.' });
    }

    setIsSubmitting(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Contact Us
      </Typography>
      <Typography variant="body1" align="center" mb={3}>
        If you have any questions, feedback, or inquiries, feel free to reach out using the form below.
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
        <Button
          variant={contactMethod === 'form' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleContactMethodChange('form')}
        >
          Message Form
        </Button>
      </Box>

      {contactMethod === 'phone' && (
        <Box textAlign="center">
          <Typography variant="h6">
            <strong>Phone:</strong>{' '}
            <a href="tel:011 234 5678">011 234 5678</a>
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

      {contactMethod === 'form' && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
            margin="normal"
          />

          <Box textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
            </Button>
          </Box>
        </form>
      )}

      {formStatus.message && (
        <Box mt={3}>
          <Alert severity={formStatus.type}>{formStatus.message}</Alert>
        </Box>
      )}
    </Container>
  );
};

export default ContactUs;
