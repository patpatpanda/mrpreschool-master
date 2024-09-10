import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import SurveyChart from './components/SurveyChart';
import Header from './components/Header';
import theme from './components/theme';
import './App.css';
import PreschoolApplicationInfo from './components/PreschoolApplicationInfo';
import ReactGA from 'react-ga';
import { Button } from '@mui/material';  // Lägg till Button från MUI

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('G-BB5BB4CLSJ'); // Ersätt med ditt Google Analytics-mätnings-ID
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App-container">
          <Header />
          
          <Analytics />
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

          {/* Lägg till knappen i det övre högra hörnet */}
          <Button
            onClick={() => window.location.href = 'https://blog.xn--frskolekollen-imb.se/'}
            variant="contained"
            sx={{
              backgroundColor: '#ffffff',  // Vit bakgrund för icke-aktiv knapp
              color: '#333',  // Mörk textfärg för läsbarhet
              position: 'fixed',  // Fixed position för att knappen ska vara i hörnet
              top: '20px',  // Placering från toppen
              right: '20px',   // Placering från högerkanten
              zIndex: 9999,  // Mycket högt z-index för att säkerställa att den visas över alla element
              padding: '10px 20px',
              fontFamily: 'Nunito, sans-serif',
              border: '2px solid #333',  // Fullständig definition av kantlinje
              borderRadius: '8px',  // Rundade hörn
              boxShadow: 'none',  // Ingen skugga för knappen
              width: '120px',  // Fast bredd för alla skärmstorlekar
              fontSize: '0.85rem',  // Fast textstorlek
              '&:hover': {
                backgroundColor: 'lightgrey',  // Ljusare bakgrund vid hover
              },
            }}
          >
            Få koll
          </Button>

        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
