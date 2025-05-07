import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableSortLabel, TablePagination, TextField, IconButton, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, Paper, Box
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "firstname", direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstname: "", lastname: "", email: "", mobilenumber: "", address: ""
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  const currentUserRole = "admin"; // Simulated admin access

  // const fetchUsers = async () => {
  //   try {
  //     const token = localStorage.getItem("token"); // Get token from localStorage
  //     console.log("🔑 Token:", token); // Debugging line to check the token

  //     // const res = await axios.get("http://localhost:5000/api/auth/users");

  //     const res = await axios.get("http://localhost:5000/api/auth/users", {
  //       headers: {
  //         Authorization: `${token}`, // Pass the token as a Bearer token
  //       },
  //     });

  //     console.log("Users fetched:", res.data);

  //     if (Array.isArray(res.data.data)) {
  //       setUsers(res.data.data); // Set users only if res.data is an array
  //     } else {
  //       console.error("Fetched data is not an array.");
  //     }

  //     console.log("Users fetched:", res.data); // Debugging line to check the fetched users
  //     setUsers(res.data);
  //     setFiltered(res.data);
  //   } catch (err) {
  //     console.error("Error:", err.message);
  //   }
  // };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      console.log("🔑 Token:", token); // Debugging line to check the token
  
      // Make the API call with the Authorization header
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `${token}`, // Pass the token as a Bearer token
        },
      });
  
      console.log("Users fetched:", res.data); // Log the fetched data
  
      // Ensure the data is an array before setting it to state
      if (Array.isArray(res.data.data)) {
        setUsers(res.data.data); // Set users if data is an array
        setFiltered(res.data.data); // Also update filtered users if necessary
      } else {
        console.error("Fetched data is not an array.");
      }
  
    } catch (err) {
      console.error("Error:", err.message);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filteredData = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredData);
  }, [searchTerm, users]);

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
      console.log(editUser);
      await axios.put(`http://localhost:5000/api/auth/update/${editUser._id}`, editUser);
      fetchUsers();
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`http://localhost:5000/api/auth/delete/${id}`);
      fetchUsers();
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm("Are you sure you want to delete selected users?")) {
      await Promise.all(selectedUsers.map(id =>
        axios.delete(`http://localhost:5000/api/auth/users/${id}`)
      ));
      setSelectedUsers([]);
      fetchUsers();
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...newUser, password: "default123"
      });
      fetchUsers();
      setAddDialogOpen(false);
      setNewUser({ firstname: "", lastname: "", email: "", mobilenumber: "", address: "" });
    } catch (err) {
      console.error("Add user error:", err.message);
    }
  };

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Mobile", "Address"];
    const rows = filtered.map((user) => [
      user.firstname, user.lastname, user.email, user.mobilenumber, user.address
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    const tableColumn = ["First Name", "Last Name", "Email", "Mobile", "Address"];
    const tableRows = users.map(user => [
      user.firstname,
      user.lastname,
      user.email,
      user.mobilenumber,
      user.address,
    ]);
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.text("User List", 14, 15);
    doc.save("users.pdf");
  };

  // const paginatedUsers = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const paginatedUsers = Array.isArray(filtered) ? filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

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
    <Container maxWidth="lg">
      <Box mt={8} p={3} component={Paper}>
        <Typography variant="h4" gutterBottom>User Management</Typography>

        <Box display="flex" gap={2} mb={2}>
          <Button variant="contained" onClick={() => setAddDialogOpen(true)}>Add User</Button>
          <Button variant="outlined" onClick={exportToCSV}>Export CSV</Button>
          <Button variant="outlined" onClick={exportToPDF}>Export PDF</Button>
          {selectedUsers.length > 0 && (
            <Button variant="contained" color="error" onClick={handleBulkDelete}>
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
        </Box>

        <TextField
          label="Search by name or email"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.includes(u._id))}
                  onChange={(e) => {
                    const ids = paginatedUsers.map(u => u._id);
                    if (e.target.checked) {
                      setSelectedUsers([...new Set([...selectedUsers, ...ids])]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => !ids.includes(id)));
                    }
                  }}
                />
              </TableCell>
              {["firstname", "lastname", "email", "mobilenumber", "address"].map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.direction}
                    onClick={() => handleSort(col)}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user._id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobilenumber}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Box>

      {/* ✏️ Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {["firstname", "lastname", "email", "mobilenumber", "address"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              margin="dense"
              fullWidth
              value={editUser?.[field] || ""}
              onChange={(e) => setEditUser({ ...editUser, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* ➕ Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {["firstname", "lastname", "email", "mobilenumber", "address"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              margin="dense"
              fullWidth
              value={newUser[field]}
              onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserList;
