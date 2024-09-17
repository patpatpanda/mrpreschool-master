import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import myImage from '../images/seri.webp'; // Standardbild
import CustomButton from './CustomButton';

const PreschoolCard = ({ preschool, onDetailsClick, onClose }) => (
  <Card
    sx={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      margin: 'auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      width: '100%',
      maxWidth: { xs: '100%', sm: '450px', md: '600px' }, // Responsiva maxWidth-värden
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
      },
    }}
  >
    {/* Stängningsknapp */}
    <IconButton
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
      sx={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 10,
        backgroundColor: '#fff', // Halvgenomskinlig bakgrund för bättre synlighet
        color: 'red', // Vit ikon för bättre kontrast
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        fontSize: '1.5rem', // Större storlek på ikonen
        padding: '8px', // Större klickbar yta
      }}
    >
      <FontAwesomeIcon icon={faTimes} />
    </IconButton>

    {/* Bild i fokus */}
    <Box
      sx={{
        position: 'relative',
        height: { xs: '200px', sm: '300px', md: '400px' }, // Gör bilden högre på större skärmar
        overflow: 'hidden',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      }}
    >
      <img
        src={preschool.bildUrl || myImage}
        alt={preschool.namn}
        style={{
          width: '100%',
          height: '80%',
          objectFit: 'cover',
        }}
      />
    </Box>

    {/* Innehåll under bilden */}
    <CardContent
      sx={{
        padding: '16px',
        '&:last-child': {
          paddingBottom: '16px',
        },
      }}
    >
      {/* Rubrik */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
        {preschool.namn}
      </Typography>

      {/* Adress */}
      <Box display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          style={{ color: '#4CAF50', marginRight: '8px', fontSize: '1rem' }}
        />
        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
          {preschool.adress}
        </Typography>
      </Box>

      {/* Beskrivning */}
      {preschool.description && (
        <Box display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
          <FontAwesomeIcon
            icon={faInfoCircle}
            style={{ color: '#FF9800', marginRight: '8px', fontSize: '1rem' }}
          />
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
            {preschool.description}
          </Typography>
        </Box>
      )}

      {/* Gångtid */}
      <Typography variant="body2" sx={{ color: '#333', fontSize: '0.875rem', marginBottom: '8px' }}>
        Gångtid: {preschool.walkingTime || 'Ingen data'} minuter
      </Typography>

      {/* Läs mer knapp */}
    
      <CustomButton 
  variant="contained"
  onClick={(event) => {
    event.stopPropagation();
    onDetailsClick(preschool);
    onClose(); // Stänger kortet när användaren klickar på "Läs mer"
  }}
>
  Läs mer
</CustomButton>


    </CardContent>
  </Card>
);

PreschoolCard.propTypes = {
  preschool: PropTypes.shape({
    namn: PropTypes.string.isRequired,
    adress: PropTypes.string.isRequired,
    description: PropTypes.string,
    bildUrl: PropTypes.string,
    walkingTime: PropTypes.string,
  }).isRequired,
  onDetailsClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PreschoolCard;
