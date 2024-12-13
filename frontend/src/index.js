import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import AgeCalculator from './components/AgeCalculator';
import Footer from './components/Footer';
import theme from './styles/theme';

const root = ReactDOM.createRoot(document.getElementById('root')); // Ensure 'root' matches the ID in index.html

root.render(
    <ThemeProvider theme={theme}>
        <Header />
        <AgeCalculator />
        <Footer />
    </ThemeProvider>
);
