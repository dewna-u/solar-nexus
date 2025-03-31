import React, { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import './ContactAdmin.css';

const ContactAdmin = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice@example.com',
            subject: 'Inquiry about solar panels',
            message: 'Can you provide more details about the solar panel efficiency?',
        },
    ]);

    const handleDelete = (id) => {
        setMessages(messages.filter(message => message.id !== id));
    };

    return (
        <Container maxWidth="md" className="admin-container">
            <Typography variant="h4" className="admin-title">Contact Messages</Typography>
            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <TableRow key={message.id}>
                                    <TableCell>{message.name}</TableCell>
                                    <TableCell>{message.email}</TableCell>
                                    <TableCell>{message.subject}</TableCell>
                                    <TableCell>{message.message}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(message.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No messages available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ContactAdmin;
