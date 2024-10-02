import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';  // Lägg till CssBaseline
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import { lightTheme, darkTheme } from './components/theme';  // Importera teman
import SplashScreen from './components/SplashScreen';
import FixedButton from './components/FixedButton';
import './App.css';
import ReactGA from 'react-ga';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Login';
import Register from './components/Register';
import CornerButtons from './components/CornerButtons';

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('G-BB5BB4CLSJ');
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [themeMode, setThemeMode] = useState('light');  // Standard läge är 'light'

  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  const handleProceed = () => {
    setShowSplash(false);
  };

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('appTheme', newTheme);  // Spara temaval i localStorage
  };

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />  {/* Lägg till CssBaseline för att applicera globala stilar */}
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App-container">
            <Header toggleTheme={toggleTheme} themeMode={themeMode} />
            <Analytics />

            {showSplash ? (
              <SplashScreen onProceed={handleProceed} />
            ) : (
              <main>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<MapComponent />} />
                  <Route path="/forskolan/:id" element={<MapComponent />} />
                  <Route path="/:address" element={<MapComponent />} />
                </Routes>
              </main>
            )}

            <CornerButtons toggleTheme={toggleTheme} themeMode={themeMode} />
            <FixedButton />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
