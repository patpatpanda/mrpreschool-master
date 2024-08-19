import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography, Box, Divider, ButtonBase } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const PreschoolCard = ({ preschool, onSelect, walkingTime }) => (
  <ButtonBase
    onClick={() => onSelect(preschool)}
    style={{
      display: 'block',
      textAlign: 'left',
      width: '100%',
      borderRadius: '10px',
      marginBottom: '20px',
      textDecoration: 'none',
    }}
  >
    <Card
      className="card"
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Mjukare skuggor för en modern känsla
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)', // Lyft kortet vid hover
          boxShadow: '0 12px 16px rgba(0, 0, 0, 0.2)', // Förstärkt skugga vid hover
        },
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
            {preschool.namn}
          </Typography>
        }
        sx={{ paddingBottom: 0 }}
      />
      <Divider />
      <CardContent
        className="card-body"
        sx={{
          padding: '16px',
          overflow: 'hidden',
        }}
      >
        <Box display="flex" alignItems="center" mb={1}>
          <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#4CAF50', marginRight: '8px' }} />
          <Typography variant="body1" sx={{ color: '#666' }}>
            {preschool.adress}
          </Typography>
        </Box>
        {preschool.description && (
          <Box display="flex" alignItems="center" mb={2}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#FF9800', marginRight: '8px' }} />
            <Typography variant="body1" sx={{ color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {preschool.description}
            </Typography>
          </Box>
        )}
        {preschool.pdfData ? (
          <Box mt={2} sx={{ color: '#333' }}>
            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
              <strong>Antal Svar:</strong> {preschool.pdfData.antalSvar} st
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
              <strong>Helhetsomdöme:</strong> {preschool.pdfData.helhetsomdome}%
            </Typography>
            <Typography variant="body2">
              <strong>Svarsfrekvens:</strong> {preschool.pdfData.svarsfrekvens}%
            </Typography>
          </Box>
        ) : (
          <Box mt={2} sx={{ color: '#333' }}>
            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
              <strong>Antal Svar:</strong> N/A
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
              <strong>Helhetsomdöme:</strong> N/A
            </Typography>
            <Typography variant="body2">
              <strong>Svarsfrekvens:</strong> N/A
            </Typography>
          </Box>
        )}
        {walkingTime && (
          <Box mt={2} sx={{ color: '#333' }}>
            <Typography variant="body2">
              <strong>Gångavstånd:</strong> {walkingTime} minuter
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </ButtonBase>
);

PreschoolCard.propTypes = {
  preschool: PropTypes.shape({
    namn: PropTypes.string.isRequired,
    adress: PropTypes.string.isRequired,
    description: PropTypes.string,
    pdfData: PropTypes.object,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  walkingTime: PropTypes.string,
};

export default PreschoolCard;
