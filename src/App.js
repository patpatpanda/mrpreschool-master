import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import SurveyChart from './components/SurveyChart';
import Header from './components/Header'; // Importera Header-komponenten
import theme from './components/theme';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header /> {/* Lägg till Header-komponenten här */}
          <main>
            <Routes>
              <Route path="/" element={<MapComponent />} />
              <Route path="/forskolan/:id" element={<MapComponent />} />
              <Route path="/survey" element={<SurveyChart />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
