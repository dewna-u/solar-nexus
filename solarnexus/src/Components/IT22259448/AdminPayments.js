import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  TableContainer,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("All");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch payments when component mounts
  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch all payments from the backend
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/payment");
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }
      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setSnackbar({
        open: true,
        message: "Failed to load payments",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search to payments
  useEffect(() => {
    let results = payments;
    
    // Apply membership filter
    if (membershipFilter !== "All") {
      results = results.filter(
        payment => payment.membershipType === membershipFilter
      );
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        payment => 
          payment.name.toLowerCase().includes(term) ||
          payment.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredPayments(results);
  }, [payments, membershipFilter, searchTerm]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle membership filter change
  const handleFilterChange = (e) => {
    setMembershipFilter(e.target.value);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (payment) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPaymentToDelete(null);
  };

  // Delete payment
  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/payment/delete/${paymentToDelete._id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete payment");
      }
      
      // Update local state
      setPayments(payments.filter(p => p._id !== paymentToDelete._id));
      setSnackbar({
        open: true,
        message: "Payment deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting payment:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete payment",
        severity: "error"
      });
    } finally {
      closeDeleteDialog();
    }
  };

  // Generate and download PDF report
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Solar Nexus - Payment Records", 14, 15);
    
    // Add filter information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Filter: ${membershipFilter} • Generated: ${new Date().toLocaleString()}`, 14, 22);
    
    // Create table data
    const tableData = filteredPayments.map((payment) => [
      payment.name,
      payment.email,
      `LKR ${payment.amount}`,
      payment.membershipType,
      payment.paymentMethod,
      new Date(payment.createdAt).toLocaleString(),
    ]);
    
    // Add table to PDF using autoTable directly
    autoTable(doc, {
      head: [["Name", "Email", "Amount", "Membership", "Method", "Date"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
    });
    
    // Save PDF
    doc.save("payment_records.pdf");
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Payment Management
      </Typography>
      
      {/* Search and Filter Bar */}
      <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search"
          variant="outlined"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="membership-filter-label">Membership</InputLabel>
          <Select
            labelId="membership-filter-label"
            value={membershipFilter}
            label="Membership"
            onChange={handleFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="All">All Plans</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
        
        <Button 
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleDownloadPDF}
          sx={{ height: 56 }}
        >
          Export PDF
        </Button>
      </Box>
      
      {/* Payment Records Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredPayments.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="subtitle1" color="text.secondary">
            No payment records found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Amount (LKR)</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Membership</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Payment Method</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>{payment.email}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: 
                          payment.membershipType === "Weekly" ? "info.light" :
                          payment.membershipType === "Monthly" ? "success.light" :
                          payment.membershipType === "Yearly" ? "warning.light" : "grey.light",
                        borderRadius: 1,
                        py: 0.5,
                        px: 1,
                        display: "inline-block"
                      }}
                    >
                      {payment.membershipType}
                    </Box>
                  </TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Delete payment">
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => openDeleteDialog(payment)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this payment record from {paymentToDelete?.name}?
            <br /><br />
            <strong>Amount:</strong> LKR {paymentToDelete?.amount}<br />
            <strong>Membership:</strong> {paymentToDelete?.membershipType}<br />
            <strong>Date:</strong> {paymentToDelete && new Date(paymentToDelete.createdAt).toLocaleString()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminPayments;
