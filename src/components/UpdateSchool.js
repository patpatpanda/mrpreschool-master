import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Alert, Typography } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';

const UpdateSchool = ({ schoolToUpdateId, currentDescription, onUpdateSuccess }) => {
  const [description, setDescription] = useState(currentDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logs, setLogs] = useState([]); // Initiera som en tom array för att undvika undefined error

  const handleUpdate = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
      setError('Ingen token hittades. Vänligen logga in igen.');
      return;
    }

    const token = user.token;
    const url = `https://masterkinder20240523125154.azurewebsites.net/api/account/update-school/${schoolToUpdateId}`;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setLogs([]);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const body = {
        Beskrivning: description, // Se till att beskrivningen sätts korrekt
      };

      const response = await axios.post(url, body, config);

      if (response.status === 200) {
        setSuccess('Uppdatering lyckades!');
        setLogs(response.data.logs || []);

        // Här anropar vi callback-funktionen för att meddela att uppdateringen lyckades och skicka tillbaka den nya beskrivningen.
        if (onUpdateSuccess) {
          onUpdateSuccess(description);
        }
      }
    } catch (err) {
      console.error('Ett fel inträffade:', err.response?.data || err.message);

      if (err.response) {
        setError(`Fel från servern: ${err.response.status} - ${err.response.data?.message || 'Ett fel inträffade'}`);
      } else {
        setError('Ett nätverksfel inträffade. Kontrollera din anslutning och försök igen.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        label="Beskrivning"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Uppdatera Beskrivning'}
        </Button>
      </Box>

      {/* Visa loggar från backend i frontend */}
      {logs.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Loggar från backend:</Typography>
          {logs.map((log, index) => (
            <Typography key={index} variant="body2">{log}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

// PropTypes för validering av props
UpdateSchool.propTypes = {
  schoolToUpdateId: PropTypes.number.isRequired,   // Förskole-ID som ska uppdateras
  currentDescription: PropTypes.string.isRequired, // Nuvarande beskrivning
  onUpdateSuccess: PropTypes.func,                 // Callback-funktion vid uppdateringsframgång
};

export default UpdateSchool;
