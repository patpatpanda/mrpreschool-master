import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';

const UpdateSchool = ({ schoolToUpdateId, currentData = {}, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    namn: currentData.namn || '',
    adress: currentData.adress || '',
    beskrivning: currentData.beskrivning || '',
    antalBarn: currentData.antalBarn || '',
    typAvService: currentData.typAvService || '',
    // Lägg till fler fält här om det behövs
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
  
      const response = await axios.post(url, formData, config);
  
      if (response.status === 200) {
        setSuccess('Uppdatering lyckades!');
  
        if (onUpdateSuccess) {
          onUpdateSuccess(formData);
        }
  
        // Ladda om sidan för att visa uppdateringarna direkt
        window.location.reload();
      }
    } catch (err) {
      console.error('Ett fel inträffade:', err.response?.data || err.message);
  
      if (err.response) {
        setError(`Fel från servern: ${err.response.status} - ${err.response.data?.message || 'Ett fel inträffade'}`);
      } 
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Fält för varje attribut i modellen */}
      <TextField
        label="Namn"
        variant="outlined"
        fullWidth
        name="namn"
        value={formData.namn}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Adress"
        variant="outlined"
        fullWidth
        name="adress"
        value={formData.adress}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Beskrivning"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        name="beskrivning"
        value={formData.beskrivning}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Antal Barn"
        variant="outlined"
        fullWidth
        name="antalBarn"
        type="number"
        value={formData.antalBarn}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Typ av Service"
        variant="outlined"
        fullWidth
        name="typAvService"
        value={formData.typAvService}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Uppdatera'}
        </Button>
      </Box>
    </Box>
  );
};

UpdateSchool.propTypes = {
  schoolToUpdateId: PropTypes.number.isRequired,
  currentData: PropTypes.object.isRequired,
  onUpdateSuccess: PropTypes.func,
};

export default UpdateSchool;
