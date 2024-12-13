import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{
        backgroundColor: '#f8f9fa', 
        padding: '20px 0', 
        marginTop: 'auto', 
        position: 'relative',
        bottom: 0, 
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              &copy; {new Date().getFullYear()} Age Calculator. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Built with ❤️ using React and Material-UI
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
