import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import myImage from '../images/seri.webp'; // Standardbild
import CustomButton from './CustomButton';

const PreschoolListCard = ({ preschool, onDetailsClick }) => (
  <Card
    sx={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      margin: '16px auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      display: 'flex',
      flexDirection: 'column', // Ändra flex-direction till kolumn för att få bilden ovanför innehållet
      padding: '16px',
      width: '100%',
      maxWidth: '600px',
      height: { xs: '400px', sm: 'auto' }, // Öka höjden för både mobil och större skärmar
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        height: { xs: '50%', sm: '300px' }, // Bilden tar halva höjden på mobil och fast höjd på större skärmar
        width: '100%', // Gör att bilden tar hela bredden
        overflow: 'hidden',
        borderRadius: '12px 12px 0 0', // Rundade hörn för toppen
      }}
    >
      <img
        src={preschool.bildUrl || myImage}
        alt={preschool.namn}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Bilden täcker hela boxen utan att förvrängas
        }}
      />
    </Box>

    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: '16px',
        
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          {preschool.namn}
        </Typography>

        <Box display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
          <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#4CAF50', marginRight: '8px', fontSize: '1rem' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            {preschool.adress}
          </Typography>
        </Box>

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

        {preschool.walkingTime && (
          <Typography variant="body2" sx={{ color: '#333', marginBottom: '8px' }}>
            Gångtid: {preschool.walkingTime} minuter
          </Typography>
        )}
      </Box>
      <CustomButton 
        variant="contained"
        onClick={(event) => {
          event.stopPropagation();
          onDetailsClick(preschool); // Detta triggar bara att visa detaljer, inte rita ut vägbeskrivningen
        }}
      >
        Läs mer
      </CustomButton>

    </CardContent>
  </Card>
);

PreschoolListCard.propTypes = {
  preschool: PropTypes.shape({
    namn: PropTypes.string.isRequired,
    adress: PropTypes.string.isRequired,
    bildUrl: PropTypes.string,
    description: PropTypes.string,
    walkingTime: PropTypes.string,
  }).isRequired,
  onDetailsClick: PropTypes.func.isRequired,
};

export default PreschoolListCard;
