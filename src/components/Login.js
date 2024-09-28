import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await AuthService.login(email, password);

      if (response && response.token) {
        setSuccess('Inloggningen lyckades!');
        
        const {  schoolId } = response;
        
        console.log("Inloggad användare:", response);

        if (schoolId) {
          navigate(`/forskolan/${schoolId}`);
        } else {
          setError('Kunde inte hitta användarens schoolId.');
        }
      } else {
        setError('Inloggningen misslyckades. Kontrollera dina uppgifter.');
      }
    } catch (error) {
      setError('Fel vid inloggning. Kontrollera dina uppgifter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box>
        <Typography variant="h5">Logga in</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={handleLogin}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Logga in'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
