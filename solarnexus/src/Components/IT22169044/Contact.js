import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');
  const [contactMethod, setContactMethod] = useState('form'); // Default is the form
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (you can replace it with your real API call)
    setTimeout(() => {
      setFormStatus('Thank you for reaching out! We will get back to you soon.');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleContactMethodChange = (method) => {
    setContactMethod(method);
  };

  return (
    <Container maxWidth="sm" className="contact-container">
      <Typography variant="h4" gutterBottom align="center">
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph align="center">
        If you have any questions or want to learn more about our solar panel systems, feel free to reach out!
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
        <form onSubmit={handleSubmit} className="contact-form">
          <TextField
            label="Full Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email Address"
            variant="outlined"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Subject"
            variant="outlined"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Message"
            variant="outlined"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            required
          />
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
            </Button>
          </Box>
        </form>
      )}

      {formStatus && (
        <Box textAlign="center" marginTop={3}>
          <Typography variant="body1" color="primary">
            {formStatus}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ContactUs;
