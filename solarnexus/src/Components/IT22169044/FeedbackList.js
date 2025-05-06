import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedbackList.css'; // Ensure this file is in the same directory

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback/get');
        setFeedbacks(response.data);
      } catch (err) {
        setError('Failed to load feedbacks: ' + err.message);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="admin-feedback-container">
      <h2 className="admin-title">Customer Feedback (Admin View)</h2>
      {error && <p className="admin-error">{error}</p>}
      <div className="table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Service Quality</th>
              <th>Value</th>
              <th>Experience</th>
              <th>Rating</th>
              
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb, index) => (
              <tr key={fb._id}>
                <td>{index + 1}</td>
                <td>{fb.name}</td>
                <td>{fb.email}</td>
                <td>{fb.serviceQuality}</td>
                <td>{fb.value}</td>
                <td>{fb.experience}</td>
                <td>{fb.rating} / 5</td>
                
                <td>{new Date(fb.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackList;
