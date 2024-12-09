import './index.css'; // Import the global CSS file
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import AgeCalculator from './components/AgeCalculator';
import theme from './styles/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <Header />
    <AgeCalculator />
  </ThemeProvider>
);
