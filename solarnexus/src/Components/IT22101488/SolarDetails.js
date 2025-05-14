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

const theme = createTheme({ /* ...your theme as before...*/ });

const API_BASE = "http://localhost:5000/api/solarInputs";
const token    = localStorage.getItem("token");

export default function SolarDetails() {
  const [solarInputs, setSolarInputs]     = useState([]);
  const [filteredInputs, setFilteredInputs] = useState([]);
  const [editData, setEditData]           = useState(null);
  const [searchTerm, setSearchTerm]       = useState("");
  const [loading, setLoading]             = useState(true);
  const [snackbar, setSnackbar]           = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAllInputs();
  }, []);

  // fetch ALL users' data
  const fetchAllInputs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolarInputs(data);
      setFilteredInputs(data);
      setSnackbar({ open: true, message: "All data loaded", severity: "success" });
    } catch (error) {
      console.error("Error fetching all inputs:", error);
      setSnackbar({ open: true, message: "Failed to load data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllInputs();
      setSnackbar({ open: true, message: "Deleted", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  const handleEdit = (input) => setEditData({ ...input });

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const upd = {
        numPanels:    parseInt(editData.numPanels, 10),
        panelCapacity: parseFloat(editData.panelCapacity),
        location:     editData.location
      };
      await axios.put(
        `${API_BASE}/admin/${editData._id}`,
        upd,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditData(null);
      fetchAllInputs();
      setSnackbar({ open: true, message: "Updated", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredInputs(
      solarInputs.filter((i) => i.location.toLowerCase().includes(term))
    );
  };

  const generateCSV = () => {
    const headers = [
      "Panels","Capacity","Total","Location",
      "D1-M","D1-N","D1-Nt","D2-M","D2-N","D2-Nt"
    ];
    const rows = filteredInputs.map(i => [
      i.numPanels, i.panelCapacity, i.totalCapacity, i.location,
      i.forecast?.day1?.morning, i.forecast?.day1?.noon, i.forecast?.day1?.night,
      i.forecast?.day2?.morning, i.forecast?.day2?.noon, i.forecast?.day2?.night,
    ]);
    const csv = `data:text/csv;charset=utf-8,${[headers, ...rows]
      .map(r => r.join(",")).join("\n")}`;
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "all_solar_data.csv";
    document.body.appendChild(link); link.click(); link.remove();
    setSnackbar({ open: true, message: "CSV exported", severity: "success" });
  };

  const handleCloseSnackbar = () => setSnackbar(s => ({ ...s, open:false }));

  const totalPanels    = filteredInputs.reduce((s,i)=>s+(i.numPanels||0),0);
  const totalCapacity = filteredInputs.reduce((s,i)=>s+(i.totalCapacity||0),0);
  const avgCapacity   = filteredInputs.length
    ? (totalCapacity/filteredInputs.length).toFixed(2)
    : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight:"100vh", py:4 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb:4, textAlign:"center" }}>
            <SolarPowerIcon sx={{ fontSize:40, mr:1 }}/>
            <Typography variant="h4">Admin: All Solar Inputs</Typography>
          </Box>

          {/* Summary */}
          <Grid container spacing={3} mb={4}>
            {[{
              label:"Total Panels", value:totalPanels
            },{
              label:"Total Capacity (kW)", value:`${totalCapacity}`
            },{
              label:"Avg Capacity (kW)", value:`${avgCapacity}`
            }].map((c,i)=>(
              <Grid key={i} item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign:"center" }}>
                    <Typography variant="h6" color="text.secondary">{c.label}</Typography>
                    <Typography variant="h3">{c.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Controls */}
          <Card sx={{ mb:4 }}>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by location"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment:<InputAdornment position="start"><SearchIcon/></InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} textAlign={{ xs:"left", md:"right" }}>
                  <Button startIcon={<RefreshIcon/>} onClick={fetchAllInputs}>Refresh</Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon/>}
                    onClick={generateCSV}
                  >
                    Export CSV
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            {loading && <LinearProgress />}
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor:"primary.light" }}>
                  <TableRow>
                    {["Panels","Cap","Total","Location","D1","D2","Actions"]
                      .map(h=>(
                        <TableCell key={h} sx={{ fontWeight:"bold", color:"white" }}>
                          {h}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInputs.length===0
                    ? <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py:3 }}>
                          No records
                        </TableCell>
                      </TableRow>
                    : filteredInputs.map(input=>(
                        <TableRow key={input._id}>
                          <TableCell>{input.numPanels}</TableCell>
                          <TableCell>{input.panelCapacity}</TableCell>
                          <TableCell>{input.totalCapacity}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <LocationOnIcon fontSize="small" sx={{ mr:1 }}/>
                              {input.location}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {[ "morning","noon","night" ].map(seg=>(
                              <Chip
                                key={seg}
                                label={`${input.forecast.day1[seg] ?? "—"}`}
                                size="small"
                                sx={{ mr:0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            {[ "morning","noon","night" ].map(seg=>(
                              <Chip
                                key={seg}
                                label={`${input.forecast.day2[seg] ?? "—"}`}
                                size="small"
                                sx={{ mr:0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit">
                              <IconButton onClick={()=>handleEdit(input)}><EditIcon/></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={()=>handleDelete(input._id)}><DeleteIcon/></IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={!!editData} onClose={()=>setEditData(null)}>
            <DialogTitle>Edit Input</DialogTitle>
            <DialogContent>
              <TextField
                label="Panels"
                type="number"
                fullWidth
                margin="normal"
                value={editData?.numPanels || ""}
                onChange={e=>setEditData(d=>({...d, numPanels:e.target.value}))}
              />
              <TextField
                label="Capacity"
                type="number"
                fullWidth
                margin="normal"
                value={editData?.panelCapacity || ""}
                onChange={e=>setEditData(d=>({...d, panelCapacity:e.target.value}))}
              />
              <TextField
                label="Location"
                fullWidth
                margin="normal"
                value={editData?.location || ""}
                onChange={e=>setEditData(d=>({...d, location:e.target.value}))}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>setEditData(null)}>Cancel</Button>
              <Button onClick={handleUpdate} variant="contained">Save</Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
