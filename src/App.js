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

          {/* Lägg till knappen i det övre vänstra hörnet */}
          <Button
            onClick={() => window.location.href = 'https://blog.xn--frskolekollen-imb.se/'}
            variant="contained"
            sx={{
              backgroundColor: '#ffffff',  // Vit bakgrund för icke-aktiv knapp
              color: '#333',  // Mörk textfärg för läsbarhet
              position: 'absolute',  // Fixed position för att knappen ska vara i hörnet
              top: '60px',  // Placering från toppen
              left: '10px',   // Placering från vänsterkanten
              zIndex: 9999,  // Mycket högt z-index för att säkerställa att den visas över alla element
              padding: '10px 20px',
              fontFamily: 'Nunito, sans-serif',
              border: '2px solid #333',  // Fullständig definition av kantlinje
              borderRadius: '8px',  // Rundade hörn
              boxShadow: 'none',  // Ingen skugga för knappen
              width: '80px',  // Fast bredd för mobiler
              fontSize: '0.85rem',  // Fast textstorlek
              '&:hover': {
                backgroundColor: 'lightgrey',  // Ljusare bakgrund vid hover
              },

              // Anpassning för större skärmar med breakpoints
              [theme.breakpoints.up('md')]: {
                top: '40px',  // Flytta längre ned på större skärmar
                right: '40px',  // Flytta till höger för större skärmar
                width: '120px',  // Större bredd för knappen på större skärmar
                fontSize: '1rem',  // Större textstorlek på större skärmar
              },
              [theme.breakpoints.up('lg')]: {
                top: '60px',  // Ännu längre ned för mycket stora skärmar
                right: '60px',  // Flytta längre bort från högerkanten
                width: '140px',  // Ännu större bredd för mycket stora skärmar
                fontSize: '1.1rem',  // Ännu större textstorlek
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
