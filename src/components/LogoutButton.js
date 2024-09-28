import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import AuthService from './AuthService';  // Importera AuthService

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();  // Anropa logout-funktionen
    navigate('/login');    // Omdirigera användaren till inloggningssidan
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="secondary">
      Logga Ut
    </Button>
  );
};

export default LogoutButton;
