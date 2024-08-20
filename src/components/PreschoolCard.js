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
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        width: '100%',
        maxWidth: '600px',
        height: 'auto',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 16px rgba(0, 0, 0, 0.2)',
        },
        '@media (max-width: 400px)': {
          maxWidth: '100%',
          borderRadius: '8px',
          padding: '8px', // Lägg till padding för att undvika att innehållet kläms
        },
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {preschool.namn}
          </Typography>
        }
        sx={{
          paddingBottom: '4px',
          paddingTop: '4px',
          '@media (max-width: 400px)': {
            fontSize: '0.8rem', // Mindre fontstorlek för små skärmar
            padding: '4px 0',
          },
        }}
      />
      <Divider />
      <CardContent
        className="card-body"
        sx={{
          padding: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '@media (max-width: 400px)': {
            padding: '4px', // Mindre padding på små skärmar
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            marginBottom: '4px',
            flexDirection: 'column',
            '@media (max-width: 400px)': {
              alignItems: 'flex-start',
            },
          }}
        >
          <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ color: '#4CAF50', marginRight: '8px', fontSize: '1rem' }}
            />
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: '0.8rem',
                width: '100%',
                wordWrap: 'break-word',
              }}
            >
              {preschool.adress}
            </Typography>
          </Box>
        </Box>
        {preschool.description && (
          <Box
            display="flex"
            alignItems="center"
            sx={{
              marginBottom: '8px',
              flexDirection: 'column',
              '@media (max-width: 400px)': {
                alignItems: 'flex-start',
              },
            }}
          >
            <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
              <FontAwesomeIcon
                icon={faInfoCircle}
                style={{ color: '#FF9800', marginRight: '8px', fontSize: '1rem' }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  fontSize: '0.8rem',
                  width: '100%',
                  wordWrap: 'break-word',
                }}
              >
                {preschool.description}
              </Typography>
            </Box>
          </Box>
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            flexDirection: 'column',
            '@media (max-width: 400px)': {
              alignItems: 'flex-start',
            },
          }}
        >
          {preschool.pdfData ? (
            <Box display="flex" flexDirection="column" sx={{ color: '#333', marginBottom: '4px' }}>
              <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                <strong>Nöjd:</strong> {preschool.pdfData.helhetsomdome}%
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                <strong>Svar:</strong> {preschool.pdfData.antalSvar} st
              </Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" sx={{ color: '#333', marginBottom: '4px' }}>
              <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                <strong>Omdöme:</strong> N/A
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                <strong>Svar:</strong> N/A
              </Typography>
            </Box>
          )}
          {walkingTime && (
            <Typography
              variant="body2"
              sx={{
                color: '#333',
                fontSize: '0.7rem',
                marginLeft: '16px',
                '@media (max-width: 400px)': {
                  marginLeft: '0',
                  marginTop: '4px',
                },
              }}
            >
              <strong>Avstånd:</strong> {walkingTime} min
            </Typography>
          )}
        </Box>
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
