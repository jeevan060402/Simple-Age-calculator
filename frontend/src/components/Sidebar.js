import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({ setTool }) => {
  return (
    <Box
      sx={{
        width: '250px',
        backgroundColor: '#f5f5f5',
        height: '100vh',
        padding: 2,
      }}
    >
      <h3 style={{ textAlign: 'center' }}>Tools</h3>
      <List>
        <ListItem button onClick={() => setTool('age')}>
          <ListItemText primary="Age Calculator" />
        </ListItem>
        <ListItem button onClick={() => setTool('bmi')}>
          <ListItemText primary="BMI Calculator" />
        </ListItem>
        <ListItem button component={Link} to="/history">
          <ListItemText primary="History" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
