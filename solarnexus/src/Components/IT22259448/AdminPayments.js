import React, { useEffect, useState, useRef } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  TablePagination,
  alpha,
  useTheme,
  createTheme,
  ThemeProvider,
  Alert,
  Snackbar,
  Backdrop,
  Badge,
  Avatar
} from "@mui/material";
import {
  Search as SearchIcon,
  FileDownload as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Custom theme for admin payments
const paymentsTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#388e3c",
      light: "#4caf50",
      dark: "#2e7d32",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Segoe UI', sans-serif",
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
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "#f5f7fa",
        },
      },
    },
  },
});

function AdminPayments() {
  const theme = paymentsTheme;
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterMembership, setFilterMembership] = useState("all");
  const [exportLoading, setExportLoading] = useState(false);

  // Summary stats
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    cardPayments: 0,
    bankPayments: 0,
    weeklyMemberships: 0,
    monthlyMemberships: 0,
    yearlyMemberships: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    if (payments.length > 0) {
      calculateStats();
      applyFilters();
    }
  }, [payments, searchTerm, filterMethod, filterMembership]);

  const calculateStats = () => {
    const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const cardPayments = payments.filter(p => p.paymentMethod === "Credit Card").length;
    const bankPayments = payments.filter(p => p.paymentMethod === "Bank Transfer").length;
    const weeklyMemberships = payments.filter(p => p.membershipType === "Weekly").length;
    const monthlyMemberships = payments.filter(p => p.membershipType === "Monthly").length;
    const yearlyMemberships = payments.filter(p => p.membershipType === "Yearly").length;

    setStats({
      totalPayments: payments.length,
      totalAmount,
      cardPayments,
      bankPayments,
      weeklyMemberships,
      monthlyMemberships,
      yearlyMemberships
    });
  };

  const applyFilters = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply payment method filter
    if (filterMethod !== "all") {
      filtered = filtered.filter(p => p.paymentMethod === filterMethod);
    }

    // Apply membership type filter
    if (filterMembership !== "all") {
      filtered = filtered.filter(p => p.membershipType === filterMembership);
    }

    setFilteredPayments(filtered);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/payment");
      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setSnackbar({
        open: true,
        message: "Failed to load payment data",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ open: false, id: null });
    setLoading(true);
    
    try {
      await fetch(`http://localhost:5000/api/payment/delete/${id}`, {
        method: "DELETE",
      });
      fetchPayments();
      setSnackbar({
        open: true,
        message: "Payment record deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting payment:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete payment record",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (payment) => {
    setEditData(payment);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/payment/update/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      handleEditClose();
      fetchPayments();
      setSnackbar({
        open: true,
        message: "Payment record updated successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      setSnackbar({
        open: true,
        message: "Failed to update payment record",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadPDF = async () => {
    setExportLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title and date
      doc.setFontSize(18);
      doc.text("Payment Records", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      if (searchTerm || filterMethod !== "all" || filterMembership !== "all") {
        let filterText = "Filters applied: ";
        if (searchTerm) filterText += `Search: "${searchTerm}" `;
        if (filterMethod !== "all") filterText += `Method: ${filterMethod} `;
        if (filterMembership !== "all") filterText += `Membership: ${filterMembership}`;
        doc.text(filterText, 14, 38);
      }
      
      // Add summary stats
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Total Payments: ${stats.totalPayments}`, 14, 48);
      doc.text(`Total Amount: $${stats.totalAmount.toFixed(2)}`, 14, 54);
      
      // Table data
      const tableData = filteredPayments.map((p) => [
        p.name,
        p.email,
        `$${p.amount}`,
        p.membershipType,
        p.paymentMethod,
        p.cardNumber || "-",
        p.expiry || "-",
        new Date(p.createdAt).toLocaleDateString(),
      ]);
      
      doc.autoTable({
        head: [
          [
            "Full Name",
            "Email",
            "Amount",
            "Membership",
            "Method",
            "Card No",
            "Expiry",
            "Date",
          ],
        ],
        body: tableData,
        startY: 60,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [25, 118, 210] },
      });
      
      doc.save("payment_records.pdf");
      
      setSnackbar({
        open: true,
        message: "PDF generated successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to generate PDF",
        severity: "error"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterMethod("all");
    setFilterMembership("all");
    setPage(0);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Credit Card":
        return <CardIcon color="primary" />;
      case "Bank Transfer":
        return <BankIcon color="secondary" />;
      default:
        return <PaymentIcon />;
    }
  };

  const getMembershipChip = (type) => {
    switch (type) {
      case "Weekly":
        return <Chip size="small" label="Weekly" color="primary" variant="outlined" />;
      case "Monthly":
        return <Chip size="small" label="Monthly" color="secondary" variant="outlined" />;
      case "Yearly":
        return <Chip size="small" label="Yearly" color="success" variant="outlined" />;
      default:
        return <Chip size="small" label={type} />;
    }
  };

  return (
    <ThemeProvider theme={paymentsTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <ReceiptIcon sx={{ mr: 1 }} /> Payment Records Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View, edit, and manage all payment transactions in the system
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Payments
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stats.totalPayments}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                      <ReceiptIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        ${stats.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                      <MoneyIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Payment Methods
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Badge badgeContent={stats.cardPayments} color="primary" max={999}>
                          <CardIcon />
                        </Badge>
                        <Badge badgeContent={stats.bankPayments} color="secondary" max={999}>
                          <BankIcon />
                        </Badge>
                      </Box>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                      <PaymentIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Memberships
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography variant="body2">
                          Weekly: <strong>{stats.weeklyMemberships}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Monthly: <strong>{stats.monthlyMemberships}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Yearly: <strong>{stats.yearlyMemberships}</strong>
                        </Typography>
                      </Box>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                      <SuccessIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters and Actions */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by name or email"
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
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value="all">All Methods</MenuItem>
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Membership</InputLabel>
                  <Select
                    value={filterMembership}
                    onChange={(e) => setFilterMembership(e.target.value)}
                    label="Membership"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={resetFilters}
                    disabled={!searchTerm && filterMethod === "all" && filterMembership === "all"}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchPayments}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                    disabled={filteredPayments.length === 0 || exportLoading}
                    color="primary"
                  >
                    {exportLoading ? "Exporting..." : "Export PDF"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Payments Table */}
          <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredPayments.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <WarningIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6">No payments found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm || filterMethod !== "all" || filterMembership !== "all"
                    ? "Try adjusting your search filters"
                    : "No payment records exist in the system"}
                </Typography>
                {(searchTerm || filterMethod !== "all" || filterMembership !== "all") && (
                  <Button startIcon={<FilterIcon />} onClick={resetFilters}>
                    Clear Filters
                  </Button>
                )}
              </Box>
            ) : (
              <>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {[
                          "Full Name",
                          "Email",
                          "Amount",
                          "Membership",
                          "Method",
                          "Card Details",
                          "Date",
                          "Actions",
                        ].map((header) => (
                          <TableCell key={header} align={header === "Actions" ? "center" : "left"}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPayments
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((payment) => (
                          <TableRow key={payment._id} hover>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: theme.palette.primary.main }}>
                                  {payment.name.charAt(0).toUpperCase()}
                                </Avatar>
                                {payment.name}
                              </Box>
                            </TableCell>
                            <TableCell>{payment.email}</TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: "bold", color: theme.palette.success.main }}>
                                ${payment.amount}
                              </Typography>
                            </TableCell>
                            <TableCell>{getMembershipChip(payment.membershipType)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                <Typography sx={{ ml: 1 }}>{payment.paymentMethod}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {payment.cardNumber ? (
                                <Box>
                                  <Typography variant="body2">
                                    {payment.cardNumber.replace(/\d(?=\d{4})/g, "*")}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Expires: {payment.expiry || "N/A"}
                                  </Typography>
                                </Box>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(payment.createdAt).toLocaleTimeString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditOpen(payment)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setConfirmDelete({ open: true, id: payment._id })}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
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
                  count={filteredPayments.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Paper>

          {/* Edit Dialog */}
          <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EditIcon sx={{ mr: 1 }} />
                Edit Payment Record
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={editData.name || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={editData.email || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={editData.amount || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Membership Type</InputLabel>
                    <Select
                      label="Membership Type"
                      name="membershipType"
                      value={editData.membershipType || ""}
                      onChange={handleEditChange}
                    >
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      label="Payment Method"
                      name="paymentMethod"
                      value={editData.paymentMethod || ""}
                      onChange={handleEditChange}
                    >
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={editData.cardNumber || ""}
                    onChange={handleEditChange}
                    fullWidth
                    disabled={editData.paymentMethod !== "Credit Card"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expiry Date"
                    name="expiry"
                    value={editData.expiry || ""}
                    onChange={handleEditChange}
                    fullWidth
                    placeholder="MM/YY"
                    disabled={editData.paymentMethod !== "Credit Card"}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={handleEditClose} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleEditSubmit} variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this payment record? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDelete({ open: false, id: null })}>
                Cancel
              </Button>
              <Button onClick={() => handleDelete(confirmDelete.id)} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Export Loading Backdrop */}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={exportLoading}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <CircularProgress color="inherit" />
              <Typography sx={{ mt: 2 }}>Generating PDF...</Typography>
            </Box>
          </Backdrop>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AdminPayments;