import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBmi(null);

    if (!weight || !height) {
      setError('Please enter valid weight and height values.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/calculate-bmi', {
        weight: parseFloat(weight),
        height: parseFloat(height),
      });
      setBmi(response.data.bmi);
    } catch (error) {
      setError('Error calculating BMI. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        BMI Calculator
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Weight (kg)"
          type="number"
          fullWidth
          margin="normal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <TextField
          label="Height (m)"
          type="number"
          fullWidth
          margin="normal"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Calculate BMI
        </Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
      {bmi && (
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Your BMI is: {bmi}
        </Typography>
      )}
    </Box>
  );
}

export default BMICalculator;
