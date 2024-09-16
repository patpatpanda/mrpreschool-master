import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material/styles'; // Importera useTheme för att använda temat
import myImage from '../images/seri.webp'; // Standardbild

const PreschoolCard = ({ preschool, onDetailsClick, onClose }) => {
  const theme = useTheme(); // Använd temat

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper, // Använd temats bakgrundsfärg
        borderRadius: '12px',
        margin: 'auto',
        boxShadow: theme.shadows[4], // Använd temats skugga
        transition: 'transform 0.3s, box-shadow 0.3s',
        width: '100%',
        maxWidth: { xs: '100%', sm: '450px', md: '600px' }, // Responsiva maxWidth-värden
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[10], // Större skugga vid hover
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
          backgroundColor: theme.palette.background.paper, // Tematiserad bakgrund
          color: theme.palette.error.main, // Använd temats "error" färg för stängningsknappen
          '&:hover': {
            backgroundColor: theme.palette.action.hover, // Tematiserad hover-effekt
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
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, marginBottom: '8px' }}>
          {preschool.namn}
        </Typography>

        {/* Adress */}
        <Box display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ color: theme.palette.primary.main, marginRight: '8px', fontSize: '1rem' }} // Använd temats primärfärg
          />
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
            {preschool.adress}
          </Typography>
        </Box>

        {/* Beskrivning */}
        {preschool.description && (
          <Box display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ color: theme.palette.secondary.main, marginRight: '8px', fontSize: '1rem' }} // Använd temats sekundärfärg
            />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
              {preschool.description}
            </Typography>
          </Box>
        )}

        {/* Gångtid */}
        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontSize: '0.875rem', marginBottom: '8px' }}>
          Gångtid: {preschool.walkingTime || 'Ingen data'} minuter
        </Typography>

        {/* Läs mer knapp */}
        <Button
          variant="contained"
          onClick={(event) => {
            event.stopPropagation();
            onDetailsClick(preschool); // Visa DetailedCard
            onClose(); // Stäng PreschoolCard
          }}
          sx={{
            backgroundColor: theme.palette.primary.main, // Använd temats primärfärg
            color: theme.palette.primary.contrastText, // Använd temats kontrasttext
            fontSize: '0.875rem',
            padding: '8px 16px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark, // Använd temats mörkare primärfärg vid hover
            },
          }}
        >
          Läs mer
        </Button>
      </CardContent>
    </Card>
  );
};

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
