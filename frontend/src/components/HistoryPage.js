import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Box, 
  Typography, 
  Container, 
  ToggleButton, 
  ToggleButtonGroup, 
  Card, 
  CardContent 
} from '@mui/material';
import { Link } from 'react-router-dom';
import './History.css';

const toolColors = {
  'Age Calculator': '#4caf50', // Green for Age Calculator
  'BMI Calculator': '#2196f3', // Blue for BMI Calculator
  'All': '#9e9e9e', // Neutral gray for "All"
};

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedTool, setSelectedTool] = useState('All');

  useEffect(() => {
    // Fetch history data from the backend
    api.get('/history')
      .then(response => {
        setHistory(response.data);
        setFilteredHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching history:', error);
      });
  }, []);

  const handleToolFilter = (event, newTool) => {
    if (newTool === null) return;

    setSelectedTool(newTool);

    if (newTool === 'All') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item => item.tool === newTool);
      setFilteredHistory(filtered);
    }
  };

  // Get unique tool types
  const toolTypes = ['All', ...new Set(history.map(item => item.tool))];

  return (
    <Box className="history-page-container" sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
      <Container>
        {/* Header */}
        <Box className="history-header" sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Tool Usage History
          </Typography>
          
          {/* Tool Filter */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={selectedTool}
              exclusive
              onChange={handleToolFilter}
              aria-label="tool filter"
              sx={{
                '& .MuiToggleButton-root': {
                  color: '#ffffff',
                  backgroundColor: toolColors['All'],
                  '&.Mui-selected': {
                    backgroundColor: toolColors[selectedTool] || toolColors['All'],
                  },
                  '&:hover': {
                    opacity: 0.9,
                  },
                },
              }}
            >
              {toolTypes.map((tool) => (
                <ToggleButton 
                  key={tool} 
                  value={tool}
                  sx={{
                    backgroundColor: toolColors[tool] || toolColors['All'],
                    margin: '0 5px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    transition: '0.3s',
                  }}
                >
                  {tool}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Typography variant="body1" color="textSecondary">
            Showing <span style={{ fontWeight: 'bold', color: toolColors[selectedTool] || '#000' }}>{selectedTool}</span> calculations
          </Typography>
        </Box>

        {/* History Cards */}
        <Box className="history-cards-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {filteredHistory.map(item => (
            <Card
              key={item.id}
              sx={{
                width: 300,
                borderRadius: 4,
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-5px)',
                },
                borderLeft: `8px solid ${toolColors[item.tool] || '#9e9e9e'}`,
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: toolColors[item.tool] || '#000' }}>
                  {item.tool}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Input:</strong> {item.input_data}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Result:</strong> {item.result}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <em>Calculated on: {new Date(item.timestamp).toLocaleString()}</em>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Back Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link to="/" className="back-button" style={{ textDecoration: 'none' }}>
            <Typography
              variant="button"
              sx={{
                backgroundColor: '#616161',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '5px',
                transition: '0.3s',
                '&:hover': { backgroundColor: '#424242' },
              }}
            >
              Back to Tools
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default HistoryPage;
