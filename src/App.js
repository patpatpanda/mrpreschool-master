import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Lägg till useLocation här
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import theme from './components/theme';
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

  const handleProceed = () => {
    setShowSplash(false);
  };

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App-container">
            <Header />
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

            <CornerButtons />

            <FixedButton />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
