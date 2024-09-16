import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
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
      flexDirection: 'row',
      padding: '16px',
      width: '100%',
      maxWidth: '600px',
      minHeight: { xs: '400px', sm: '00px' }, // Öka höjden för både mobil och större skärmar
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        height: { xs: '180px', sm: '250px' }, // Öka höjden för bilder på både mobil och desktop
        width: '150px', // Bredd för bildsektionen
        overflow: 'hidden',
        borderRadius: '12px',
      }}
    >
      <img
        src={preschool.bildUrl || myImage}
        alt={preschool.namn}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>

    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: '16px',
        width: 'calc(100% - 150px)', // Justera bredden för innehållsdelen
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

        {/* Lägg till beskrivning om den finns */}
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

        {/* Lägg till gångtid om den finns */}
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
          onDetailsClick(preschool);
        }}
       
        
      >
        Läs mer
      </CustomButton >
    </CardContent>
  </Card>
);

PreschoolListCard.propTypes = {
  preschool: PropTypes.shape({
    namn: PropTypes.string.isRequired,
    adress: PropTypes.string.isRequired,
    bildUrl: PropTypes.string,
    description: PropTypes.string,  // Lägg till beskrivning som optional prop
    walkingTime: PropTypes.string,  // Lägg till gångtid som optional prop
  }).isRequired,
  onDetailsClick: PropTypes.func.isRequired,
};

export default PreschoolListCard;
