import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography, Box, ButtonBase, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import myImage from '../images/seri.webp'; // Standardbild

const PreschoolCard = ({ preschool, onSelect }) => (
  <ButtonBase
    onClick={() => onSelect(preschool)}
    style={{
      display: 'block',
      textAlign: 'left',
      width: '100%',
      borderRadius: '8px',
      marginBottom: '16px', // Minska marginalen för bättre anpassning
      textDecoration: 'none',
    }}
  >
    <Card
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        margin: 'auto',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        width: '100%',
        maxWidth: { xs: '100%', sm: '400px', md: '500px' }, // Använd responsiva maxWidth-värden
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
        },
        '@media (max-width: 400px)': {
          padding: '6px',
        },
      }}
    >
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
        <Box sx={{ flexGrow: 1, minWidth: 0 }}> {/* minWidth: 0 för att undvika text overflow */}
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
              backgroundColor: 'rgba(252, 230, 213, 0.5)', // Genomskinlig färg
              color: '#333',
              '&:hover': {
                backgroundColor: '#555',
                color:'#fff'
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
            maxWidth: { xs: '30%', sm: '25%' },  // Bildens maxbredd responsivt
            '@media (max-width: 600px)': {  // Media query för mindre skärmar
              marginLeft: '8px',
            },
          }}
        >
          <img
            src={preschool.bildUrl || myImage}  // Använd bildUrl från props eller standardbild
            alt={preschool.namn}
            style={{
              width: '100%',  // Använd hela bredden på sin container
              height: 'auto',  // Automatisk höjd för att bevara bildförhållandet
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
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
    bildUrl: PropTypes.string,  // Lägg till bildUrl-prop
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PreschoolCard;
