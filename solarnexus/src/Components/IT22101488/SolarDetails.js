// SolarDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Box,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
  LinearProgress
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Green shade for solar theme
    },
    secondary: {
      main: "#ff9800", // Orange for contrast
    },
    background: {
      default: "#f9f9f9",
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
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
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

function SolarDetails() {
  const [solarInputs, setSolarInputs] = useState([]);
  const [filteredInputs, setFilteredInputs] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchSolarInputs();
  }, []);

  const fetchSolarInputs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/solarInputs");

      // Normalize: if API returns { input, dates }, wrap input in array
      let inputs = Array.isArray(data)
        ? data
        : data.input
          ? [data.input]
          : [];

      setSolarInputs(inputs);
      setFilteredInputs(inputs);
      setSnackbar({ open: true, message: "Data loaded successfully", severity: "success" });
    } catch (error) {
      console.error("Error fetching solar inputs:", error);
      setSnackbar({ open: true, message: "Failed to load data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/solarInputs/${id}`);
      fetchSolarInputs();
      setSnackbar({ open: true, message: "Record deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Error deleting input:", error);
      setSnackbar({ open: true, message: "Failed to delete record", severity: "error" });
    }
  };

  const handleEdit = (input) => {
    setEditData({ ...input });
  };

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const updatedData = {
        numPanels: parseInt(editData.numPanels, 10) || 0,
        panelCapacity: parseFloat(editData.panelCapacity) || 0,
        location: editData.location || "",
      };

      await axios.put(
        `http://localhost:5000/api/solarInputs/${editData._id}`,
        updatedData
      );
      setEditData(null);
      fetchSolarInputs();
      setSnackbar({ open: true, message: "Record updated successfully", severity: "success" });
    } catch (error) {
      console.error("Error updating input:", error);
      setSnackbar({ open: true, message: "Failed to update record", severity: "error" });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    setFilteredInputs(
      solarInputs.filter((item) =>
        item.location.toLowerCase().includes(term)
      )
    );
  };

  const generateCSV = () => {
    const headers = [
      "Number of Panels",
      "Panel Capacity (kW)",
      "Total Capacity (kW)",
      "Location",
      "Day 1 - Morning",
      "Day 1 - Noon",
      "Day 1 - Night",
      "Day 2 - Morning",
      "Day 2 - Noon",
      "Day 2 - Night",
    ];

    const rows = filteredInputs.map((item) => [
      item.numPanels,
      item.panelCapacity,
      item.totalCapacity,
      item.location,
      item.forecast?.day1?.morning ?? "",
      item.forecast?.day1?.noon ?? "",
      item.forecast?.day1?.night ?? "",
      item.forecast?.day2?.morning ?? "",
      item.forecast?.day2?.noon ?? "",
      item.forecast?.day2?.night ?? "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "solar_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbar({ open: true, message: "CSV exported successfully", severity: "success" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate summary stats
  const totalPanels = filteredInputs.reduce((sum, item) => sum + (item.numPanels || 0), 0);
  const totalCapacity = filteredInputs.reduce((sum, item) => sum + (item.totalCapacity || 0), 0);
  const averageCapacity = filteredInputs.length ? (totalCapacity / filteredInputs.length).toFixed(2) : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SolarPowerIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
            <Typography variant="h4" color="primary.main">
              Solar Input Management
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Solar Panels
                  </Typography>
                  <Typography variant="h3" color="primary.main" fontWeight="bold">
                    {totalPanels}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Capacity
                  </Typography>
                  <Typography variant="h3" color="primary.main" fontWeight="bold">
                    {totalCapacity} kW
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Average Capacity
                  </Typography>
                  <Typography variant="h3" color="primary.main" fontWeight="bold">
                    {averageCapacity} kW
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by location..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchSolarInputs}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={generateCSV}
                    color="primary"
                  >
                    Export CSV
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 0 }}>
              {loading && <LinearProgress />}
              
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.light" }}>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Panels</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Capacity (kW)</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Total (kW)</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Day 1 Forecast</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Day 2 Forecast</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInputs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            No records found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInputs.map((input, index) => (
                        <TableRow 
                          key={input._id}
                          sx={{ 
                            "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                            "&:hover": { bgcolor: "action.selected" }
                          }}
                        >
                          <TableCell>{input.numPanels}</TableCell>
                          <TableCell>{input.panelCapacity}</TableCell>
                          <TableCell>
                            <Typography fontWeight="medium" color="primary">
                              {input.totalCapacity}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              {input.location}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              <Tooltip title="Morning">
                                <Chip
                                  label={`🌅 ${input.forecast?.day1?.morning ?? "—"} kWh`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Tooltip>
                              <Tooltip title="Noon">
                                <Chip
                                  label={`🌤️ ${input.forecast?.day1?.noon ?? "—"} kWh`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </Tooltip>
                              <Tooltip title="Night">
                                <Chip
                                  label={`🌙 ${input.forecast?.day1?.night ?? "—"} kWh`}
                                  size="small"
                                  color="default"
                                  variant="outlined"
                                />
                              </Tooltip>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              <Tooltip title="Morning">
                                <Chip
                                  label={`🌅 ${input.forecast?.day2?.morning ?? "—"} kWh`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Tooltip>
                              <Tooltip title="Noon">
                                <Chip
                                  label={`🌤️ ${input.forecast?.day2?.noon ?? "—"} kWh`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </Tooltip>
                              <Tooltip title="Night">
                                <Chip
                                  label={`🌙 ${input.forecast?.day2?.night ?? "—"} kWh`}
                                  size="small"
                                  color="default"
                                  variant="outlined"
                                />
                              </Tooltip>
                            </Box>
                          </TableCell>

                          <TableCell align="center">
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleEdit(input)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleDelete(input._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Dialog
            open={!!editData}
            onClose={() => setEditData(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: { borderRadius: 2 }
            }}
          >
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
              Edit Solar Input
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ pt: 1 }}>
                <TextField
                  label="Number of Panels"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={editData?.numPanels ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, numPanels: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SolarPowerIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Panel Capacity (kW)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={editData?.panelCapacity ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, panelCapacity: e.target.value })
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                  }}
                />
                <TextField
                  label="Location"
                  fullWidth
                  margin="normal"
                  value={editData?.location ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setEditData(null)} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleUpdate} variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={4000} 
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
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default SolarDetails;