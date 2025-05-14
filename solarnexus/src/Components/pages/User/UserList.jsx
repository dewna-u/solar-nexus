//Userlist.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TableSortLabel, TablePagination, TextField, IconButton, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, Paper, Box, Chip, Avatar,
  Tooltip, Grid, Card, CardContent, InputAdornment, Divider, Alert,
  Snackbar, CircularProgress, Checkbox, FormControl, InputLabel, Select,
  MenuItem, Backdrop, useTheme, createTheme, ThemeProvider, alpha, Tab, Tabs
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FileDownload as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon,
  Block as BlockIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Custom theme for user management
const userTheme = createTheme({
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

const UserList = () => {
  const theme = userTheme;
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "firstname", direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstname: "", lastname: "", email: "", mobilenumber: "", address: "", role: "user"
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, multiple: false });
  const [exportLoading, setExportLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    users: 0,
    recentlyAdded: 0
  });

  const currentUserRole = "admin"; // Simulated admin access

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token:", token);

      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(res.data.data) ? res.data.data : res.data;
      if (Array.isArray(data)) {
        setUsers(data);
        setFiltered(data);
        calculateUserStats(data);
      } else {
        console.error("Invalid user data format.");
        setSnackbar({
          open: true,
          message: "Failed to load user data: Invalid format",
          severity: "error"
        });
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: `Failed to load users: ${err.response?.data?.message || err.message}`,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (userData) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: userData.length,
      active: userData.filter(user => user.status !== "inactive").length,
      admins: userData.filter(user => user.role === "admin").length,
      users: userData.filter(user => user.role === "user").length,
      recentlyAdded: userData.filter(user => new Date(user.createdAt) > oneWeekAgo).length
    };
    
    setUserStats(stats);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filteredData = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.mobilenumber && user.mobilenumber.includes(searchTerm))
    );
    
    // Apply tab filtering
    let tabFiltered = filteredData;
    if (tabValue === 1) {
      tabFiltered = filteredData.filter(user => user.role === "admin");
    } else if (tabValue === 2) {
      tabFiltered = filteredData.filter(user => user.role === "user");
    }
    
    setFiltered(tabFiltered);
  }, [searchTerm, users, tabValue]);

  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });

    const sorted = [...filtered].sort((a, b) => {
      if (a[key] < b[key]) return isAsc ? -1 : 1;
      if (a[key] > b[key]) return isAsc ? 1 : -1;
      return 0;
    });

    setFiltered(sorted);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/auth/update/${editUser._id}`, editUser);
      fetchUsers();
      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: "User updated successfully",
        severity: "success"
      });
    } catch (err) {
      console.error("Update error:", err.message);
      setSnackbar({
        open: true,
        message: `Failed to update user: ${err.response?.data?.message || err.message}`,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ open: false, id: null, multiple: false });
    setLoading(true);
    
    try {
      await axios.delete(`http://localhost:5000/api/auth/delete/${id}`);
      fetchUsers();
      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success"
      });
    } catch (err) {
      console.error("Delete error:", err.message);
      setSnackbar({
        open: true,
        message: `Failed to delete user: ${err.response?.data?.message || err.message}`,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setConfirmDelete({ open: false, id: null, multiple: false });
    setLoading(true);
    
    try {
      await Promise.all(selectedUsers.map(id =>
        axios.delete(`http://localhost:5000/api/auth/delete/${id}`)
      ));
      setSelectedUsers([]);
      fetchUsers();
      setSnackbar({
        open: true,
        message: `${selectedUsers.length} users deleted successfully`,
        severity: "success"
      });
    } catch (err) {
      console.error("Bulk delete error:", err.message);
      setSnackbar({
        open: true,
        message: `Failed to delete users: ${err.response?.data?.message || err.message}`,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register", {
        ...newUser, password: "default123"
      });
      fetchUsers();
      setAddDialogOpen(false);
      setNewUser({
        firstname: "", lastname: "", email: "", mobilenumber: "", address: "", role: "user"
      });
      setSnackbar({
        open: true,
        message: "User added successfully",
        severity: "success"
      });
    } catch (err) {
      console.error("Add user error:", err.message);
      setSnackbar({
        open: true,
        message: `Failed to add user: ${err.response?.data?.message || err.message}`,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    setExportLoading(true);
    
    try {
      const headers = ["First Name", "Last Name", "Email", "Mobile", "Address", "Role"];
      const rows = filtered.map((user) => [
        user.firstname, user.lastname, user.email, user.mobilenumber, user.address, user.role
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();
      
      setSnackbar({
        open: true,
        message: "CSV exported successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("CSV export error:", error);
      setSnackbar({
        open: true,
        message: "Failed to export CSV",
        severity: "error"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const exportToPDF = () => {
    setExportLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title and date
      doc.setFontSize(18);
      doc.text("User Management Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      if (searchTerm) {
        doc.text(`Search term: "${searchTerm}"`, 14, 38);
      }
      
      // Add summary stats
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Total Users: ${userStats.total}`, 14, 48);
      doc.text(`Admins: ${userStats.admins}`, 14, 54);
      doc.text(`Regular Users: ${userStats.users}`, 14, 60);
      
      const tableColumn = ["First Name", "Last Name", "Email", "Mobile", "Address", "Role"];
      const tableRows = filtered.map(user => [
        user.firstname, user.lastname, user.email, user.mobilenumber || "N/A", user.address || "N/A", user.role,
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [25, 118, 210] },
      });
      
      doc.save("users.pdf");
      
      setSnackbar({
        open: true,
        message: "PDF exported successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      setSnackbar({
        open: true,
        message: "Failed to export PDF",
        severity: "error"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedUsers.map(user => user._id);
      setSelectedUsers([...new Set([...selectedUsers, ...newSelected])]);
    } else {
      const paginatedIds = paginatedUsers.map(user => user._id);
      setSelectedUsers(selectedUsers.filter(id => !paginatedIds.includes(id)));
    }
  };

  const handleSelectUser = (id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedUsers, id];
    } else {
      newSelected = selectedUsers.filter(userId => userId !== id);
    }

    setSelectedUsers(newSelected);
  };

  const isSelected = (id) => selectedUsers.indexOf(id) !== -1;

  const paginatedUsers = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (currentUserRole !== "admin") {
    return (
      <Container maxWidth="sm">
        <Box mt={8} p={3} component={Paper}>
          <Typography variant="h5">Access Denied</Typography>
          <Typography>You must be an admin to view this page.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={userTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon sx={{ mr: 1 }} /> User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View, edit, and manage all users in the system
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
                        Total Users
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {userStats.total}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                      <PersonIcon />
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
                        Administrators
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {userStats.admins}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main }}>
                      <VerifiedIcon />
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
                        Regular Users
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {userStats.users}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                      <PersonIcon />
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
                        Recently Added
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {userStats.recentlyAdded}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last 7 days
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                      <AddIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs and Actions */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="user tabs">
                <Tab label="All Users" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Administrators" icon={<VerifiedIcon />} iconPosition="start" />
                <Tab label="Regular Users" icon={<PersonIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by name, email or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={() => {
                        setSearchTerm("");
                        setTabValue(0);
                      }}
                      disabled={!searchTerm && tabValue === 0}
                    >
                      Reset Filters
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={fetchUsers}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={exportToCSV}
                      disabled={filtered.length === 0 || exportLoading}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={exportToPDF}
                      disabled={filtered.length === 0 || exportLoading}
                    >
                      Export PDF
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddDialogOpen(true)}
                      color="primary"
                    >
                      Add User
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* User Table */}
          <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <WarningIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6">No users found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm || tabValue !== 0
                    ? "Try adjusting your search filters"
                    : "No user records exist in the system"}
                </Typography>
                {(searchTerm || tabValue !== 0) && (
                  <Button startIcon={<FilterIcon />} onClick={() => {
                    setSearchTerm("");
                    setTabValue(0);
                  }}>
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
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedUsers.length > 0 && selectedUsers.length < paginatedUsers.length}
                            checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.includes(u._id))}
                            onChange={handleSelectAllClick}
                          />
                        </TableCell>
                        {["firstname", "lastname", "email", "mobilenumber", "address", "role"].map((col) => (
                          <TableCell key={col}>
                            <TableSortLabel
                              active={sortConfig.key === col}
                              direction={sortConfig.direction}
                              onClick={() => handleSort(col)}
                            >
                              {col === "firstname" ? "First Name" :
                               col === "lastname" ? "Last Name" :
                               col === "email" ? "Email" :
                               col === "mobilenumber" ? "Mobile" :
                               col === "address" ? "Address" : "Role"}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedUsers.map((user) => {
                        const isItemSelected = isSelected(user._id);
                        
                        return (
                          <TableRow 
                            key={user._id} 
                            hover
                            selected={isItemSelected}
                            sx={{ '&.Mui-selected': { backgroundColor: alpha(theme.palette.primary.main, 0.1) } }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={() => handleSelectUser(user._id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar 
                                  sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    mr: 1, 
                                    bgcolor: user.role === "admin" ? theme.palette.error.main : theme.palette.primary.main 
                                  }}
                                >
                                  {user.firstname.charAt(0).toUpperCase()}
                                </Avatar>
                                {user.firstname}
                              </Box>
                            </TableCell>
                            <TableCell>{user.lastname}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <EmailIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                {user.email}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {user.mobilenumber ? (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                  {user.mobilenumber}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Not provided
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.address ? (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <LocationIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                  {user.address}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Not provided
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.role === "admin" ? "Administrator" : "User"}
                                color={user.role === "admin" ? "error" : "primary"}
                                size="small"
                                icon={user.role === "admin" ? <VerifiedIcon /> : <PersonIcon />}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEdit(user)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setConfirmDelete({ open: true, id: user._id, multiple: false })}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                  {selectedUsers.length > 0 && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setConfirmDelete({ open: true, id: null, multiple: true })}
                    >
                      Delete Selected ({selectedUsers.length})
                    </Button>
                  )}
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filtered.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                  />
                </Box>
              </>
            )}
          </Paper>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EditIcon sx={{ mr: 1 }} />
                Edit User
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstname"
                    value={editUser?.firstname || ""}
                    onChange={(e) => setEditUser({ ...editUser, firstname: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastname"
                    value={editUser?.lastname || ""}
                    onChange={(e) => setEditUser({ ...editUser, lastname: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={editUser?.email || ""}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile Number"
                    name="mobilenumber"
                    value={editUser?.mobilenumber || ""}
                    onChange={(e) => setEditUser({ ...editUser, mobilenumber: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      name="role"
                      value={editUser?.role || "user"}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={editUser?.address || ""}
                    onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setEditDialogOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleEditSave} variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Dialog */}
          <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AddIcon sx={{ mr: 1 }} />
                Add New User
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                A default password of "default123" will be assigned to the new user.
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstname"
                    value={newUser.firstname}
                    onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastname"
                    value={newUser.lastname}
                    onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile Number"
                    name="mobilenumber"
                    value={newUser.mobilenumber}
                    onChange={(e) => setNewUser({ ...newUser, mobilenumber: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      name="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setAddDialogOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleAddUser} variant="contained" color="primary">
                Add User
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null, multiple: false })}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                {confirmDelete.multiple
                  ? `Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`
                  : "Are you sure you want to delete this user? This action cannot be undone."}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDelete({ open: false, id: null, multiple: false })}>
                Cancel
              </Button>
              <Button 
                onClick={() => confirmDelete.multiple ? handleBulkDelete() : handleDelete(confirmDelete.id)} 
                color="error" 
                variant="contained"
              >
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
              <Typography sx={{ mt: 2 }}>Generating export file...</Typography>
            </Box>
          </Backdrop>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserList;