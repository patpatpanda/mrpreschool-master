import React from 'react';
import { Button, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService'; // Se till att AuthService är korrekt
import { useMediaQuery } from '@mui/material';

const CornerButtons = () => {
  const navigate = useNavigate();
  
  // Hämta den inloggade användaren (om det finns någon)
  const user = AuthService.getCurrentUser();

  // Kontrollera om skärmen är mindre än 600px
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
          {!isSmallScreen ? (
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
          ) : (
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(`/forskolan/${user.schoolId}`)}
              sx={{ 
                textDecoration: 'underline', 
                cursor: 'pointer', 
                marginTop: '10px' // Lägger till margin-top
              }}
            >
              Min Förskola
            </Link>
          )}
          {!isSmallScreen ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Logga ut
            </Button>
          ) : (
            <Link
              component="button"
              variant="body2"
              onClick={handleLogout}
              sx={{ 
                textDecoration: 'underline', 
                cursor: 'pointer', 
                marginTop: '1px' // Lägger till margin-top
              }}
            >
              Logga ut
            </Link>
          )}
        </>
      ) : (
        <>
          {!isSmallScreen ? (
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
          ) : (
            <>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ 
                  textDecoration: 'underline', 
                  cursor: 'pointer', 
                  marginTop: '20px' // Lägger till margin-top
                }}
              >
                Logga in
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ 
                  textDecoration: 'underline', 
                  cursor: 'pointer', 
                  marginTop: '20px' // Lägger till margin-top
                }}
              >
                Registrera
              </Link>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default CornerButtons;
