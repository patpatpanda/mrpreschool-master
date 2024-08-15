import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import SurveyChart from './components/SurveyChart'; // Importera SurveyChart
import theme from './components/theme';

import './App.css';

function AppContent() {
  const location = useLocation();
  const isSurveyPage = location.pathname === '/survey';

  useEffect(() => {
    if (isSurveyPage) {
      document.body.classList.add('scrollable');
    } else {
      document.body.classList.remove('scrollable');
    }

    // Clean up by removing the class when component unmounts
    return () => {
      document.body.classList.remove('scrollable');
    };
  }, [isSurveyPage]);

  return (
    <div className={`App ${isSurveyPage ? 'scrollable' : ''}`}>
      <nav>
        {/* Lägg till din navigering här */}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/forskolan/:id" element={<MapComponent />} />
          <Route path="/survey" element={<SurveyChart />} /> {/* Ny rutt för SurveyChart */}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
