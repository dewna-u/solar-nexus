// routes/feedback.js
const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');

// Feedback CRUD Routes
router.post('/create', createFeedback);        // Create feedback
router.get('/get', getFeedbacks);              // Get all feedbacks
router.get('/getbyid/:id', getFeedbackById);   // Get single feedback by ID
router.put('/update/:id', updateFeedback);     // Update feedback by ID
router.delete('/delete/:id', deleteFeedback);  // Delete feedback by ID

module.exports = router;
