import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Container, Typography, Paper } from '@mui/material';

const SplashScreen = ({ onProceed }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="rgba(0, 0, 0, 0.7)"
      zIndex={10000}
      p={2}
    >
      <Container 
        maxWidth="md" // Ökar maxbredden för större skärmar
        sx={{ 
          height: 'auto', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight:'40px',
        }}
      >
        <Paper 
          elevation={4}
          sx={{ 
            width: '100%', 
            padding: { xs: 3, sm: 4, md: 6 }, // Justerad padding för större skärmar
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
            borderRadius: 3,
            maxWidth: { xs: '90%', sm: '80%', md: '60%' }, // Begränsa bredden för att se bra ut på olika skärmar
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Välkommen!
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: { xs: 2, md: 3 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Utforska närliggande förskolor och hitta detaljerad information. För närvarande stödjer vi bara förskolor inom stockholmsområdet.
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: { xs: 2, md: 3 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Ange din adress i sökrutan för att börja.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onProceed}
            sx={{
              padding: { xs: '8px 16px', md: '12px 24px' }, // Justerad padding för större knappar på större skärmar
              fontSize: { xs: '14px', md: '16px' },
            }}
          >
            Kom igång
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

SplashScreen.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default SplashScreen;
