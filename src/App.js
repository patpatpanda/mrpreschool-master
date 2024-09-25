import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MapComponent from './components/MapComponent';

import Header from './components/Header';
import theme from './components/theme';
import SplashScreen from './components/SplashScreen'; // Importera SplashScreen-komponenten
import FixedButton from './components/FixedButton'; // Importera FixedButton-komponenten
import './App.css';

import ReactGA from 'react-ga';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importera QueryClientProvider

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('G-BB5BB4CLSJ'); // Ersätt med ditt Google Analytics-mätnings-ID
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  // Lägg till ett state för att hantera om splash-skärmen visas eller inte
  const [showSplash, setShowSplash] = useState(true);

  // Funktion för att hantera när användaren klickar på "Kom igång"
  const handleProceed = () => {
    setShowSplash(false); // Dölj splash-skärmen när användaren klickar
  };

  // Skapa en instans av QueryClient
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      {/* Omslut applikationen med QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App-container">
            
            <Header />
            <Analytics />

            {/* Visa splash-skärmen om showSplash är true */}
            {showSplash ? (
              <SplashScreen onProceed={handleProceed} />
            ) : (
              <main>
                <Routes>
                  <Route path="/" element={<MapComponent />} />
                  <Route path="/forskolan/:id" element={<MapComponent />} />
                
                
                  <Route path="/:address" element={<MapComponent />} />
                </Routes>
              </main>
            )}

            {/* Lägg till den fasta knappen i det övre högra hörnet */}
            <FixedButton />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
