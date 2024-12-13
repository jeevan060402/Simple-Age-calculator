import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import AgeCalculator from './components/AgeCalculator';
import Footer from './components/Footer';
import HistoryPage from './components/HistoryPage';
import theme from './styles/theme';

// Create a separate App component
const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route path="/" element={<AgeCalculator />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </Router>
  );
};

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: export App if you need to use it elsewhere
export default App;