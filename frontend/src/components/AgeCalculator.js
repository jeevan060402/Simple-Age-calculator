import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import './AgeCalculator.css'; // Import the updated CSS file for animations

function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setAge(null);

    if (!dob) {
      setError('Please enter a valid date of birth');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/calculate-age', { dob });
      setAge(response.data.age);
    } catch (error) {
      setError('Error calculating age. Please try again.');
    }
  };

  return (
    <div className="animated-background">
      <Box className="age-calculator-container">
        <Typography variant="h3" gutterBottom>
          Age Calculator
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Calculate Age
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {age && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5">You are {age} years old</Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default AgeCalculator;
