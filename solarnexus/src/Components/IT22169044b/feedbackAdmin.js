import React, { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import './feedbackAdmin.css';

const FeedbackAdmin = () => {
    const [feedbacks, setFeedbacks] = useState([]); // Removed the initial feedback row

    const handleDelete = (id) => {
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
    };

    return (
        <Container maxWidth="md" className="admin-container">
            <Typography variant="h4" className="admin-title">Feedback Management</Typography>
            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Service Quality</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Public</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <TableRow key={feedback.id}>
                                    <TableCell>{feedback.name}</TableCell>
                                    <TableCell>{feedback.email}</TableCell>
                                    <TableCell>{feedback.serviceQuality}</TableCell>
                                    <TableCell>{feedback.value}</TableCell>
                                    <TableCell>{feedback.experience}</TableCell>
                                    <TableCell>{feedback.rating}</TableCell>
                                    <TableCell>{feedback.sharePublicly}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(feedback.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No feedback available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default FeedbackAdmin;
