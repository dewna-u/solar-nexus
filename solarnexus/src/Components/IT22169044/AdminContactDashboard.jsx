import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';

// Simulated admin check (replace with real auth later)
const isAdmin = true;

const AdminContactDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact/messages');
      const data = await res.json();
      setMessages(data);
      setFilteredMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        msg.subject.toLowerCase().includes(query)
    );
    setFilteredMessages(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        setFilteredMessages((prev) => prev.filter((msg) => msg._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (!isAdmin) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center" mt={5}>
          Access denied. Admins only.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Contact Messages (Admin)
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search by name, email, or subject"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
        />

        <CSVLink data={filteredMessages} filename="contact_messages.csv" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ ml: 2 }}
          >
            Export CSV
          </Button>
        </CSVLink>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Message</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMessages.map((msg) => (
              <TableRow key={msg._id}>
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleDelete(msg._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredMessages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminContactDashboard;
