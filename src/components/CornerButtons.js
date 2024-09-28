import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService'; // Se till att AuthService är korrekt

const CornerButtons = () => {
  const navigate = useNavigate();
  
  // Hämta den inloggade användaren (om det finns någon)
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login'); // Omdirigera till inloggningssidan efter utloggning
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 16, sm: 32 }, // Placering för mobiler och större skärmar
        left: { xs: 16, sm: 32 }, // Flytta till vänstra hörnet för mobil
        display: 'flex',
        flexDirection: 'column', // Vertikal layout
        gap: 2,
        zIndex: 1000,
        '@media (max-width: 600px)': {
          left: 16, // Vänster position för mobil
        },
      }}
    >
      {user ? (
        <>
          {/* Dölj knappen "Min Förskola" på skärmar under 600px */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/forskolan/${user.schoolId}`)}
            sx={{
              display: { xs: 'none', sm: 'block' }, // Dölj på små skärmar (xs)
            }}
          >
            Min Förskola
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
          >
            Logga ut
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Logga in
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/register')}
          >
            Registrera
          </Button>
        </>
      )}
    </Box>
  );
};

export default CornerButtons;
