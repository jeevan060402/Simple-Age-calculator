import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './History.css';  // Import the CSS for history page

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch history data from the backend
    api.get('/history') // Replace with your actual API endpoint
      .then(response => {
        setHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching history:', error);
      });
  }, []);

  return (
    <Box className="history-page-container">
      <Container>
        <div className="history-header">
          <Typography variant="h4" gutterBottom>
            History of Age Calculations
          </Typography>
          <Typography variant="body1">
            Below is a list of past age calculations, sorted by date.
          </Typography>
        </div>

        <div className="history-cards-container">
          {history.map(item => (
            <div key={item.id} className="history-card">
              <Typography variant="h5">DOB: {item.dob}</Typography>
              <Typography variant="body1">Age: {item.calculated_age}</Typography>
              <Typography variant="body2">
                <span>Calculated on: {new Date(item.timestamp).toLocaleString()}</span>
              </Typography>
            </div>
          ))}
        </div>

        <Link to="/" className="back-button">
          Back to Age Calculator
        </Link>
      </Container>
    </Box>
  );
}

export default HistoryPage;
