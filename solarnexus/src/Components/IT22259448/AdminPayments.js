import React, { useEffect, useState } from "react";
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
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment");
      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      await fetch(`http://localhost:5000/api/payment/delete/${id}`, {
        method: "DELETE",
      });
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
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
    try {
      await fetch(`http://localhost:5000/api/payment/update/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      handleEditClose();
      fetchPayments();
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = payments.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term)
    );
    setFilteredPayments(filtered);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Records", 14, 16);
    const tableData = filteredPayments.map((p) => [
      p.name,
      p.email,
      p.amount,
      p.paymentMethod,
      p.cardNumber || "-",
      p.expiry || "-",
      new Date(p.createdAt).toLocaleString(),
    ]);
    doc.autoTable({
      head: [
        [
          "Full Name",
          "Email",
          "Amount (LKR)",
          "Method",
          "Card No",
          "Expiry",
          "Date",
        ],
      ],
      body: tableData,
      startY: 20,
    });
    doc.save("payment_records.pdf");
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin - Payment Records
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        onClick={handleDownloadPDF}
        sx={{ mb: 2, float: "right" }}
      >
        Download PDF
      </Button>

      {loading ? (
        <CircularProgress />
      ) : filteredPayments.length === 0 ? (
        <Typography>No payments found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Full Name",
                  "Email",
                  "Amount (LKR)",
                  "Membership Type",
                  "Method",
                  "Card No",
                  "Expiry",
                  "Date",
                  "Actions",
                ].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>{payment.email}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.membershipType}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{payment.cardNumber || "-"}</TableCell>
                  <TableCell>{payment.expiry || "-"}</TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => handleEditOpen(payment)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleDelete(payment._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            name="name"
            value={editData.name || ""}
            onChange={handleEditChange}
          />
          <TextField
            label="Email"
            name="email"
            value={editData.email || ""}
            onChange={handleEditChange}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={editData.amount || ""}
            onChange={handleEditChange}
          />
          {/* <TextField
            label="Membership Type"
            name="membershipType"
            type="String"
            value={editData.membershipType || ""}
            onChange={handleEditChange}
          /> */}
          <FormControl fullWidth>
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
          <TextField
            label="Payment Method"
            name="paymentMethod"
            value={editData.paymentMethod || ""}
            onChange={handleEditChange}
          />
          <TextField
            label="Card Number"
            name="cardNumber"
            value={editData.cardNumber || ""}
            onChange={handleEditChange}
          />
          <TextField
            label="Expiry"
            name="expiry"
            value={editData.expiry || ""}
            onChange={handleEditChange}
          />
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPayments;
