import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography, Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import myImage from '../images/seri.webp'; // Standardbild

const PreschoolCard = ({ preschool,  onDetailsClick, onClose }) => (
  <Card
    sx={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      margin: 'auto',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      width: '100%',
      maxWidth: { xs: '100%', sm: '400px', md: '500px' }, // Responsiva maxWidth-värden
      position: 'relative', // Behövs för den mintgröna sidan
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
      },
      '@media (max-width: 400px)': {
        padding: '6px',
      },
    }}
  >
    {/* Mintgrön sida */}
    <Box
      sx={{
        background: 'linear-gradient(45deg, #62727b 30%, #a7c0cd 90%)',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',  // Bredden på den färgade sidan
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      }}
    />

    <CardHeader
      title={
        <Typography variant="subtitle1" sx={{ color: '#333', fontWeight: 'bold', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
          {preschool.namn}
        </Typography>
      }
      sx={{
        paddingBottom: '4px',
        paddingTop: '4px',
        paddingLeft: '8px',
        paddingRight: '8px',
      }}
    />
    <CardContent
      sx={{
        padding: '8px',
        '&:last-child': {
          paddingBottom: '8px',
        },
        display: 'flex',
        flexDirection: 'row', // Rada upp innehållet horisontellt
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Textinnehåll */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box display="flex" alignItems="center" sx={{ marginBottom: '4px' }}>
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ color: '#4CAF50', marginRight: '6px', fontSize: '0.9rem' }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '0.75rem',
              wordWrap: 'break-word',
            }}
          >
            {preschool.adress}
          </Typography>
        </Box>
        {preschool.description && (
          <Box display="flex" alignItems="center" sx={{ marginBottom: '10px' }}>
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ color: '#FF9800', marginRight: '6px', fontSize: '0.9rem' }}
            />
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '0.75rem',
                wordWrap: 'break-word',
              }}
            >
              {preschool.description}
            </Typography>
          </Box>
        )}
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontSize: '0.75rem',
            marginBottom: '8px',
          }}
        >
          Gångtid: {preschool.walkingTime || 'Ingen data'} minuter
        </Typography>

        {/* Knappar */}
        <Button
          variant="contained"
          onClick={(event) => {
            event.stopPropagation();
            onDetailsClick(preschool);
          }}
          sx={{
            alignSelf: 'flex-start',
            padding: '4px 8px',
            fontSize: '0.75rem',
            marginTop: '4px',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
            color: '#333',
            '&:hover': {
              backgroundColor: '#555',
              color: '#fff',
            },
          }}
        >
          Läs mer
        </Button>


      </Box>

      {/* Bild */}
      <Box
        sx={{
          marginLeft: '16px',
          maxWidth: { xs: '30%', sm: '25%' },
          '@media (max-width: 600px)': {
            marginLeft: '8px',
          },
        }}
      >
        <img
          src={preschool.bildUrl || myImage}
          alt={preschool.namn}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
      </Box>
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
