import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Header() {
  return (
    <AppBar position="dynamic">
      <Toolbar>
        <Typography variant="h6">Age Calculator</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
