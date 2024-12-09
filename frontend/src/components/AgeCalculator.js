import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import backgroundImage from '../assets/background.jpg';  // Import background image

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
    <Box
      sx={{
        maxWidth: 500,
        margin: '0 auto',
        padding: 3,
        backgroundImage: `url(${backgroundImage})`,  // Use the imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        boxShadow: 3,
      }}
    >
      <Typography variant="h1" align="center" gutterBottom>
        Calculate Your Age
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
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Calculate
            </Button>
          </Grid>
        </Grid>
      </form>
      {error && <Typography color="error" align="center">{error}</Typography>}
      {age && (
        <Box sx={{ marginTop: 3, textAlign: 'center' }}>
          <Typography variant="h6">Your Age is: {age}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default AgeCalculator;
