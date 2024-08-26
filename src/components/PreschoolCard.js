import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography, Box, ButtonBase, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const PreschoolCard = ({ preschool, onSelect }) => (
  <ButtonBase
    onClick={() => onSelect(preschool)}
    style={{
      display: 'block',
      textAlign: 'left',
      width: '100%',
      borderRadius: '8px',
      marginBottom: '12px', // Reduced margin-bottom to make cards closer
      textDecoration: 'none',
    }}
  >
    <Card
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reduced box-shadow for a flatter appearance
        transition: 'transform 0.3s, box-shadow 0.3s',
        width: '100%',
        maxWidth: '500px', // Reduced max-width to ensure compactness
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
        },
        '@media (max-width: 400px)': {
          maxWidth: '100%',
          borderRadius: '6px',
          padding: '6px', // Reduced padding for smaller screens
        },
      }}
    >
      <CardHeader
        title={
          <Typography variant="subtitle1" sx={{ color: '#333', fontWeight: 'bold', fontSize: '0.85rem' }}>
            {preschool.namn}
          </Typography>
        }
        sx={{
          paddingBottom: '4px',
          paddingTop: '4px',
          paddingLeft: '8px',
          paddingRight: '8px', // Reduced padding
        }}
      />
      <CardContent
        sx={{
          padding: '8px', // Reduced padding
          '&:last-child': {
            paddingBottom: '8px', // Ensures no extra padding at the bottom
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box display="flex" alignItems="center" sx={{ marginBottom: '4px' }}>
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ color: '#4CAF50', marginRight: '6px', fontSize: '0.9rem' }} // Slightly smaller icon
          />
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '0.75rem', // Reduced font size
              wordWrap: 'break-word',
            }}
          >
            {preschool.adress}
          </Typography>
        </Box>
        {preschool.description && (
          <Box display="flex" alignItems="center" sx={{ marginBottom: '6px' }}>
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ color: '#FF9800', marginRight: '6px', fontSize: '0.9rem' }} // Slightly smaller icon
            />
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '0.75rem', // Reduced font size
                wordWrap: 'break-word',
              }}
            >
              {preschool.description}
            </Typography>
          </Box>
        )}
        <Button
          variant="text"
          color="primary"
          onClick={() => onSelect(preschool)}
          sx={{
            alignSelf: 'flex-start',
            padding: '4px 8px', // Reduced padding for the button
            fontSize: '0.75rem', // Reduced font size
            marginTop: '4px', // Reduced margin-top
            textTransform: 'none',
          }}
        >
          Läs mer
        </Button>
      </CardContent>
    </Card>
  </ButtonBase>
);

PreschoolCard.propTypes = {
  preschool: PropTypes.shape({
    namn: PropTypes.string.isRequired,
    adress: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PreschoolCard;
