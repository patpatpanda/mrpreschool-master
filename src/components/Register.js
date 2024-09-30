import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await AuthService.register(email, password, schoolId);

      if (response.status === 200) {
        setSuccess('Registrering lyckades! Du kan nu logga in.');
        navigate('/login');
      } else {
        setError('Registreringen misslyckades. Försök igen.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Ogiltigt skollId.');
      } else {
        setError('Fel vid registrering. Kontrollera dina uppgifter.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box>
        <Typography variant="h5">Registrera</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={handleRegister}>
          <TextField
            label="E-postadress"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Lösenord"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Skol-id"
            variant="outlined"
            fullWidth
            margin="normal"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrera'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
