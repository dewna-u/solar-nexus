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
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function SolarDetails() {
  const [solarInputs, setSolarInputs] = useState([]);
  const [filteredInputs, setFilteredInputs] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSolarInputs();
  }, []);

  const fetchSolarInputs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/solarInputs");
      setSolarInputs(response.data);
      setFilteredInputs(response.data);
    } catch (error) {
      console.error("Error fetching solar inputs:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/solarInputs/${id}`);
        fetchSolarInputs();
      } catch (error) {
        console.error("Error deleting input:", error);
      }
    }
  };

  const handleEdit = (input) => {
    setEditData({ ...input });
  };

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const updatedData = {
        numPanels: parseInt(editData.numPanels),
        panelCapacity: parseFloat(editData.panelCapacity),
        location: editData.location,
      };
      await axios.put(`http://localhost:5000/api/solarInputs/${editData._id}`, updatedData);
      setEditData(null);
      fetchSolarInputs();
    } catch (error) {
      console.error("Error updating input:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = solarInputs.filter((item) =>
      item.location.toLowerCase().includes(term)
    );
    setFilteredInputs(filtered);
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
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "solar_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        ⚡ Solar Input Management (Admin Panel)
      </Typography>

      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by location..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={generateCSV}
            sx={{ fontWeight: "bold" }}
          >
            Export CSV
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell><strong>Panels</strong></TableCell>
              <TableCell><strong>Capacity (kW)</strong></TableCell>
              <TableCell><strong>Total (kW)</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Day 1 Forecast</strong></TableCell>
              <TableCell><strong>Day 2 Forecast</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInputs.map((input) => (
              <TableRow key={input._id}>
                <TableCell>{input.numPanels}</TableCell>
                <TableCell>{input.panelCapacity}</TableCell>
                <TableCell>{input.totalCapacity}</TableCell>
                <TableCell>{input.location}</TableCell>
                <TableCell>
                  <Chip label={`🌅 ${input.forecast?.day1?.morning ?? "—"} kWh`} sx={{ mr: 1 }} />
                  <Chip label={`🌤️ ${input.forecast?.day1?.noon ?? "—"} kWh`} sx={{ mr: 1 }} />
                  <Chip label={`🌙 ${input.forecast?.day1?.night ?? "—"} kWh`} />
                </TableCell>
                <TableCell>
                  <Chip label={`🌅 ${input.forecast?.day2?.morning ?? "—"} kWh`} sx={{ mr: 1 }} />
                  <Chip label={`🌤️ ${input.forecast?.day2?.noon ?? "—"} kWh`} sx={{ mr: 1 }} />
                  <Chip label={`🌙 ${input.forecast?.day2?.night ?? "—"} kWh`} />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(input)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    size="small"
                    onClick={() => handleDelete(input._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editData} onClose={() => setEditData(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Solar Input</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Number of Panels"
            type="number"
            fullWidth
            margin="dense"
            value={editData?.numPanels || ""}
            onChange={(e) => setEditData({ ...editData, numPanels: e.target.value })}
          />
          <TextField
            label="Panel Capacity (kW)"
            type="number"
            fullWidth
            margin="dense"
            value={editData?.panelCapacity || ""}
            onChange={(e) => setEditData({ ...editData, panelCapacity: e.target.value })}
          />
          <TextField
            label="Location"
            fullWidth
            margin="dense"
            value={editData?.location || ""}
            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditData(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SolarDetails;
