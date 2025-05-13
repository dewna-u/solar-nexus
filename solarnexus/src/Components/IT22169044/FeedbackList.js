import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  TablePagination,
  IconButton,
  Tooltip,
  alpha,
  createTheme,
  ThemeProvider
} from '@mui/material';
import {
  Search as SearchIcon,
  SentimentSatisfiedAlt as SatisfiedIcon,
  SentimentDissatisfied as DissatisfiedIcon,
  SentimentNeutral as NeutralIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Custom theme for feedback admin view
const feedbackTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#388e3c',
      light: '#4caf50',
      dark: '#2e7d32',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Segoe UI', sans-serif",
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f7fa',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    verySatisfied: 0,
    satisfied: 0,
    notSatisfied: 0
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0) {
      applyFilters();
      calculateStats();
    }
  }, [feedbacks, searchTerm]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/feedback/get');
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load feedbacks: ' + err.message);
      setFeedbacks([]);
      setFilteredFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!searchTerm) {
      setFilteredFeedbacks(feedbacks);
      return;
    }

    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.serviceQuality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.experience.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredFeedbacks(filtered);
    setPage(0);
  };

  const calculateStats = () => {
    const totalFeedbacks = feedbacks.length;
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalFeedbacks > 0 ? (totalRating / totalFeedbacks).toFixed(1) : 0;
    
    const verySatisfied = feedbacks.filter(f => f.serviceQuality === 'Very Satisfied').length;
    const satisfied = feedbacks.filter(f => f.serviceQuality === 'Satisfied').length;
    const notSatisfied = feedbacks.filter(f => f.serviceQuality === 'Not Satisfied').length;

    setStats({
      totalFeedbacks,
      averageRating,
      verySatisfied,
      satisfied,
      notSatisfied
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getSatisfactionIcon = (satisfaction) => {
    switch (satisfaction) {
      case 'Very Satisfied':
        return <SatisfiedIcon sx={{ color: feedbackTheme.palette.success.main }} />;
      case 'Satisfied':
        return <NeutralIcon sx={{ color: feedbackTheme.palette.warning.main }} />;
      case 'Not Satisfied':
        return <DissatisfiedIcon sx={{ color: feedbackTheme.palette.error.main }} />;
      default:
        return null;
    }
  };

  const getSatisfactionChip = (satisfaction) => {
    switch (satisfaction) {
      case 'Very Satisfied':
        return <Chip 
          icon={<SatisfiedIcon />} 
          label="Very Satisfied" 
          size="small" 
          color="success" 
          variant="outlined" 
        />;
      case 'Satisfied':
        return <Chip 
          icon={<NeutralIcon />} 
          label="Satisfied" 
          size="small" 
          color="warning" 
          variant="outlined" 
        />;
      case 'Not Satisfied':
        return <Chip 
          icon={<DissatisfiedIcon />} 
          label="Not Satisfied" 
          size="small" 
          color="error" 
          variant="outlined" 
        />;
      default:
        return <Chip label={satisfaction} size="small" />;
    }
  };

  return (
    <ThemeProvider theme={feedbackTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Customer Feedback Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and analyze all customer feedback submissions
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Feedbacks
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.totalFeedbacks}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      bgcolor: alpha(feedbackTheme.palette.primary.main, 0.1), 
                      p: 1.5, 
                      borderRadius: '50%',
                      color: feedbackTheme.palette.primary.main
                    }}>
                      <StarIcon fontSize="large" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Average Rating
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.averageRating}
                      </Typography>
                      <Rating 
                        value={parseFloat(stats.averageRating)} 
                        precision={0.1} 
                        readOnly 
                        size="small" 
                      />
                    </Box>
                    <Box sx={{ 
                      bgcolor: alpha(feedbackTheme.palette.warning.main, 0.1), 
                      p: 1.5, 
                      borderRadius: '50%',
                      color: feedbackTheme.palette.warning.main
                    }}>
                      <StarIcon fontSize="large" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Very Satisfied
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.verySatisfied}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stats.totalFeedbacks > 0 
                          ? `${Math.round((stats.verySatisfied / stats.totalFeedbacks) * 100)}%` 
                          : '0%'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      bgcolor: alpha(feedbackTheme.palette.success.main, 0.1), 
                      p: 1.5, 
                      borderRadius: '50%',
                      color: feedbackTheme.palette.success.main
                    }}>
                      <SatisfiedIcon fontSize="large" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Not Satisfied
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.notSatisfied}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stats.totalFeedbacks > 0 
                          ? `${Math.round((stats.notSatisfied / stats.totalFeedbacks) * 100)}%` 
                          : '0%'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      bgcolor: alpha(feedbackTheme.palette.error.main, 0.1), 
                      p: 1.5, 
                      borderRadius: '50%',
                      color: feedbackTheme.palette.error.main
                    }}>
                      <DissatisfiedIcon fontSize="large" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Actions */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, or feedback type"
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Tooltip title="Reset Filters">
                    <IconButton 
                      color="primary" 
                      onClick={() => setSearchTerm('')}
                      disabled={!searchTerm}
                    >
                      <FilterIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh Data">
                    <IconButton color="primary" onClick={fetchFeedbacks}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export to PDF">
                    <IconButton color="primary">
                      <PdfIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Feedback Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredFeedbacks.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <WarningIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6">No feedbacks found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm
                    ? 'Try adjusting your search filters'
                    : 'No feedback records exist in the system'}
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Service Quality</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Experience</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Submitted</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredFeedbacks
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((feedback, index) => (
                          <TableRow key={feedback._id} hover>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{feedback.name}</TableCell>
                            <TableCell>{feedback.email}</TableCell>
                            <TableCell>{getSatisfactionChip(feedback.serviceQuality)}</TableCell>
                            <TableCell>{getSatisfactionChip(feedback.value)}</TableCell>
                            <TableCell>{getSatisfactionChip(feedback.experience)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating 
                                  value={feedback.rating} 
                                  readOnly 
                                  size="small" 
                                  icon={<StarIcon fontSize="inherit" />}
                                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  ({feedback.rating}/5)
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {new Date(feedback.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(feedback.createdAt).toLocaleTimeString()}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredFeedbacks.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default FeedbackList;