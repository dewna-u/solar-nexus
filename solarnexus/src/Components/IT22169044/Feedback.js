//Feedback.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, TextField, MenuItem, FormControl, Button,
  Box, Rating, Grid, Card, CardContent, IconButton, Divider, InputAdornment,
  Paper, Tabs, Tab, Alert, Snackbar, Chip, Avatar, useTheme, createTheme,
  ThemeProvider, alpha, CircularProgress, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import axios from 'axios';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Send as SendIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  FilterList as FilterListIcon,
  SentimentSatisfiedAlt as SatisfiedIcon,
  SentimentDissatisfied as DissatisfiedIcon,
  SentimentNeutral as NeutralIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Comment as CommentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Custom theme for feedback system
const feedbackTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: '#ffb400',
        },
        iconHover: {
          color: '#ffb400',
        },
      },
    },
  },
});

const Feedback = () => {
  const theme = feedbackTheme;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceQuality: '',
    value: '',
    experience: '',
    rating: 0,
    sharePublicly: false,
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const pdfRef = useRef();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/feedback/get');
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks', error);
      setSnackbar({
        open: true,
        message: 'Failed to load feedbacks. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/feedback/update/${currentId}`, formData);
        setSnackbar({
          open: true,
          message: 'Feedback updated successfully!',
          severity: 'success',
        });
        setEditMode(false);
        setCurrentId(null);
      } else {
        await axios.post('http://localhost:5000/api/feedback/create', formData);
        setSnackbar({
          open: true,
          message: 'Feedback submitted successfully!',
          severity: 'success',
        });
      }
      fetchFeedbacks();
      setFormData({
        name: '',
        email: '',
        serviceQuality: '',
        value: '',
        experience: '',
        rating: 0,
        sharePublicly: false,
      });
      setTabValue(1); // Switch to the feedbacks list tab
    } catch (error) {
      console.error('Error submitting feedback', error);
      setSnackbar({
        open: true,
        message: 'Error submitting feedback. Please try again.',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id) => {
    const feedback = feedbacks.find((f) => f._id === id);
    setFormData(feedback);
    setEditMode(true);
    setCurrentId(id);
    setTabValue(0); // Switch to the form tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/feedback/delete/${deleteDialog.id}`);
      setSnackbar({
        open: true,
        message: 'Feedback deleted successfully!',
        severity: 'success',
      });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback', error);
      setSnackbar({
        open: true,
        message: 'Error deleting feedback. Please try again.',
        severity: 'error',
      });
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) {
      setFilteredFeedbacks(feedbacks);
      return;
    }

    const filtered = feedbacks.filter((f) =>
      f.name.toLowerCase().includes(term) ||
      f.email.toLowerCase().includes(term) ||
      f.serviceQuality.toLowerCase().includes(term) ||
      f.experience.toLowerCase().includes(term) ||
      f.rating.toString().includes(term)
    );

    setFilteredFeedbacks(filtered);
  };

  const generatePDF = async () => {
    setSnackbar({
      open: true,
      message: 'Generating PDF...',
      severity: 'info',
    });
    
    const input = pdfRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('feedbacks_report.pdf');
    
    setSnackbar({
      open: true,
      message: 'PDF generated successfully!',
      severity: 'success',
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getSatisfactionIcon = (satisfaction) => {
    switch (satisfaction) {
      case 'Very Satisfied':
        return <SatisfiedIcon sx={{ color: theme.palette.success.main }} />;
      case 'Satisfied':
        return <NeutralIcon sx={{ color: theme.palette.warning.main }} />;
      case 'Not Satisfied':
        return <DissatisfiedIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return null;
    }
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const getSatisfactionPercentage = (type) => {
    if (feedbacks.length === 0) return 0;
    const count = feedbacks.filter(f => f.serviceQuality === type).length;
    return Math.round((count / feedbacks.length) * 100);
  };

  return (
    <ThemeProvider theme={feedbackTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Tab 
                label="Submit Feedback" 
                icon={<CommentIcon />} 
                iconPosition="start"
              />
              <Tab 
                label="View Feedbacks" 
                icon={<StarIcon />} 
                iconPosition="start"
              />
            </Tabs>

            {/* Submit Feedback Form */}
            <Box sx={{ display: tabValue === 0 ? 'block' : 'none', p: 4 }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom color="primary.main">
                  {editMode ? 'Edit Your Feedback' : 'Share Your Experience'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {editMode 
                    ? 'Update your feedback to help us improve our services.'
                    : 'Your feedback helps us improve our services and better meet your needs.'}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        label="Service Quality"
                        name="serviceQuality"
                        value={formData.serviceQuality}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ThumbUpIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Very Satisfied">Very Satisfied</MenuItem>
                        <MenuItem value="Satisfied">Satisfied</MenuItem>
                        <MenuItem value="Not Satisfied">Not Satisfied</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        label="Value for Money"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ThumbUpIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Very Satisfied">Very Satisfied</MenuItem>
                        <MenuItem value="Satisfied">Satisfied</MenuItem>
                        <MenuItem value="Not Satisfied">Not Satisfied</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        label="Overall Experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ThumbUpIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Very Satisfied">Very Satisfied</MenuItem>
                        <MenuItem value="Satisfied">Satisfied</MenuItem>
                        <MenuItem value="Not Satisfied">Not Satisfied</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Rate Your Overall Experience
                      </Typography>
                      <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={handleRating}
                        precision={1}
                        size="large"
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        sx={{ fontSize: 40 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {formData.rating === 0
                          ? 'Select a rating'
                          : formData.rating === 5
                          ? 'Excellent!'
                          : formData.rating === 4
                          ? 'Very Good!'
                          : formData.rating === 3
                          ? 'Good'
                          : formData.rating === 2
                          ? 'Fair'
                          : 'Poor'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{ px: 5, py: 1.5 }}
                  >
                    {submitting
                      ? 'Submitting...'
                      : editMode
                      ? 'Update Feedback'
                      : 'Submit Feedback'}
                  </Button>
                  {editMode && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      sx={{ ml: 2, px: 5, py: 1.5 }}
                      onClick={() => {
                        setEditMode(false);
                        setCurrentId(null);
                        setFormData({
                          name: '',
                          email: '',
                          serviceQuality: '',
                          value: '',
                          experience: '',
                          rating: 0,
                          sharePublicly: false,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </form>
            </Box>

            {/* Feedbacks List */}
            <Box sx={{ display: tabValue === 1 ? 'block' : 'none', p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="h4" color="primary.main">
                    Customer Feedbacks
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Search feedbacks..."
                      value={searchTerm}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: { xs: '100%', sm: 250 } }}
                    />
                    <Tooltip title="Export to PDF">
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={generatePDF}
                        disabled={filteredFeedbacks.length === 0}
                      >
                        Export
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
                
                {feedbacks.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          }}
                        >
                          <Typography variant="h5" color="primary.main">
                            {getAverageRating()}
                          </Typography>
                          <Rating value={parseFloat(getAverageRating())} precision={0.1} readOnly />
                          <Typography variant="body2" color="text.secondary">
                            Average Rating ({feedbacks.length} reviews)
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                          }}
                        >
                          <Typography variant="h5" color="success.main">
                            {getSatisfactionPercentage('Very Satisfied')}%
                          </Typography>
                          <SatisfiedIcon color="success" />
                          <Typography variant="body2" color="text.secondary">
                            Very Satisfied Customers
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.05),
                          }}
                        >
                          <Typography variant="h5" color="warning.main">
                            {getSatisfactionPercentage('Satisfied')}%
                          </Typography>
                          <NeutralIcon color="warning" />
                          <Typography variant="body2" color="text.secondary">
                            Satisfied Customers
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <div ref={pdfRef}>
                  <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                      Customer Feedback Report
                    </Typography>
                    <Typography variant="subtitle2" align="center" color="text.secondary">
                      Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                      {searchTerm && <span> | Filtered by: "{searchTerm}"</span>}
                    </Typography>
                  </Box>

                  {filteredFeedbacks.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <CommentIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No feedbacks found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm
                          ? 'Try adjusting your search criteria.'
                          : 'Be the first to submit feedback!'}
                      </Typography>
                      {searchTerm && (
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mt: 2 }}
                          onClick={() => setSearchTerm('')}
                          startIcon={<FilterListIcon />}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredFeedbacks.map((feedback) => (
                        <Grid item xs={12} sm={6} md={4} key={feedback._id}>
                          <Card>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: '#fff',
                                    width: 40,
                                    height: 40,
                                  }}
                                >
                                  {feedback.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ ml: 2 }}>
                                  <Typography variant="h6">{feedback.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {feedback.email}
                                  </Typography>
                                </Box>
                                <Box sx={{ ml: 'auto' }}>
                                  <Chip
                                    size="small"
                                    label={`${feedback.rating}/5`}
                                    icon={<StarIcon />}
                                    color={
                                      feedback.rating >= 4
                                        ? 'success'
                                        : feedback.rating >= 3
                                        ? 'primary'
                                        : 'error'
                                    }
                                  />
                                </Box>
                              </Box>
                              
                              <Divider sx={{ mb: 2 }} />
                              
                              <Grid container spacing={1}>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" sx={{ width: 120 }}>
                                      Service Quality:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {getSatisfactionIcon(feedback.serviceQuality)}
                                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {feedback.serviceQuality}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" sx={{ width: 120 }}>
                                      Value:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {getSatisfactionIcon(feedback.value)}
                                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {feedback.value}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" sx={{ width: 120 }}>
                                      Experience:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {getSatisfactionIcon(feedback.experience)}
                                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {feedback.experience}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ width: 120 }}>
                                      Rating:
                                    </Typography>
                                    <Rating value={feedback.rating} readOnly size="small" />
                                  </Box>
                                </Grid>
                              </Grid>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(feedback._id)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteConfirm(feedback._id)}
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {filteredFeedbacks.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
                      </Typography>
                      {searchTerm && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<FilterListIcon />}
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </Box>
                  )}
                </div>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this feedback? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Feedback;