import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Box, 
  Dialog, 
  DialogContent, 
  CircularProgress 
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalculateIcon from '@mui/icons-material/Calculate';
import Confetti from 'react-confetti';
import api from '../services/api';
import './AgeCalculator.css';

function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setAge(null);
    setLoading(true);

    if (!dob) {
      setError('Please enter a valid date of birth');
      setLoading(false);
      return;
    }

    try {
      // Simulate a loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await api.post('/calculate-age', { dob });
      setAge(response.data.age);
      
      // Show congratulations dialog
      setShowCongrats(true);
    } catch (error) {
      setError('Error calculating age. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowCongrats(false);
  };

  return (
    <div className="animated-background">
      <Box 
        sx={{
          maxWidth: 400,
          margin: 'auto',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            marginBottom: 3,
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
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
                InputLabelProps={{ 
                  shrink: true,
                  sx: { 
                    transform: 'translate(14px, -6px) scale(0.75)',
                    color: 'primary.main'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <CalendarTodayIcon 
                      sx={{ 
                        color: 'action.active', 
                        marginRight: 1,
                        fontSize: '1.2rem'
                      }} 
                    />
                  ),
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
                variant="outlined"
                required
                sx={{
                  '& input': {
                    padding: '12px 14px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={loading}
                startIcon={loading ? null : <CalculateIcon />}
                sx={{
                  height: 50,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&.Mui-disabled': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                {loading ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <CircularProgress size={24} color="inherit" />
                  </Box>
                ) : (
                  'Calculate Age'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mt: 2, 
              textAlign: 'center',
              fontWeight: 'medium'
            }}
          >
            {error}
          </Typography>
        )}
        
        {/* Congratulations Dialog */}
        <Dialog open={showCongrats} onClose={handleCloseDialog}>
          <DialogContent sx={{ 
            textAlign: 'center', 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <Confetti 
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
            />
            <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
              Congratulations!
            </Typography>
            <Typography variant="h5">
              You are {age} years old
            </Typography>
            <Button 
              onClick={handleCloseDialog} 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
}

export default AgeCalculator;