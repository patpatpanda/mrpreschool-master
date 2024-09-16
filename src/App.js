import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import SurveyChart from './components/SurveyChart';
import Header from './components/Header';
import theme from './components/theme';
import SplashScreen from './components/SplashScreen'; // Importera SplashScreen-komponenten
import FixedButton from './components/FixedButton'; // Importera FixedButton-komponenten
import './App.css';
import PreschoolApplicationInfo from './components/PreschoolApplicationInfo';
import ReactGA from 'react-ga';

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

  return (
    <ThemeProvider theme={theme}>
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
                <Route path="/survey" element={<SurveyChart />} />
                <Route path="/PreschoolApplicationInfo" element={<PreschoolApplicationInfo />} />
                {/* Lägg till en dynamisk route för adresser */}
                <Route path="/:address" element={<MapComponent />} />
              </Routes>
            </main>
          )}

          {/* Lägg till den fasta knappen i det övre högra hörnet */}
          <FixedButton />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
