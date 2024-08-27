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
      marginBottom: '12px',
      textDecoration: 'none',
    }}
  >
    <Card
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        width: '100%',
        maxWidth: '500px',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
        },
        '@media (max-width: 400px)': {
          maxWidth: '100%',
          borderRadius: '6px',
          padding: '6px',
          
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
          flexDirection: 'column',
        }}
      >
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
        {/* Här är den mörka knappen */}
        <Button
          variant="contained"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(preschool);
          }}
          sx={{
            alignSelf: 'flex-start',
            padding: '4px 8px',
            fontSize: '0.75rem',
            marginTop: '4px',
            textTransform: 'none',
            backgroundColor: '#3f1d3ba3', // Mörk färg
            color: '#fff', // Vit textfärg
            '&:hover': {
              backgroundColor: '#555', // Mörkare grå vid hovring
            },
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
