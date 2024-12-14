import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Tooltip 
} from '@mui/material';
import { 
  ThemeProvider, 
  createTheme, 
  styled 
} from '@mui/material/styles';
import { 
  Calculate as AgeIcon, 
  HeightOutlined as BMIIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import './index.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AgeCalculator from './components/AgeCalculator';
import BMICalculator from './components/BMICalculator';
import HistoryPage from './components/HistoryPage';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        },
      },
    },
  },
});

// Styled Sidebar Component
const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const SIDEBAR_WIDTH = {
    collapsed: 72,
    expanded: 240
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const sidebarItems = [
    {
      path: '/',
      icon: <AgeIcon />,
      label: 'Age Calculator',
      state: 'age'
    },
    {
      path: '/',
      icon: <BMIIcon />,
      label: 'BMI Calculator',
      state: 'bmi'
    },
    {
      path: '/history',
      icon: <HistoryIcon />,
      label: 'History',
      state: 'history'
    }
  ];

  return (
    <Drawer
      ref={sidebarRef}
      variant="permanent"
      sx={{
        width: isExpanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isExpanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed,
          boxSizing: 'border-box',
          overflowX: 'hidden',
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            key={item.label}
            button
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              justifyContent: 'center',
              px: 2,
            }}
          >
            <Tooltip 
              title={!isExpanded ? item.label : ''} 
              placement="right"
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: isExpanded ? 2 : 'auto' }}>
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {isExpanded && (
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { 
                    opacity: isExpanded ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }
                }} 
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

// Main App Component
const App = () => {
  const [tool, setTool] = useState('age');

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar for Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            ml: '72px' // Match collapsed sidebar width
          }}>
            {/* Header */}
            <Header />

            {/* Routes */}
            <Box sx={{ flex: 1, padding: 3 }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    tool === 'age' ? <AgeCalculator /> : <BMICalculator />
                  }
                />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </Box>

            {/* Footer */}
            <Footer />
          </Box>
        </Box>
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

export default App;

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}