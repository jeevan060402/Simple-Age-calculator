import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Age Calculator
        </Typography>
        <Box>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link to="/history" style={{ textDecoration: 'none' }}>
            <Button color="inherit">History</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
