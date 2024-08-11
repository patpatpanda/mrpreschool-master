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
      bgcolor="rgba(0, 0, 0, 0.5)"
      zIndex={100000000}
      p={2}
    >
      <Container 
        maxWidth="md" // Större bredd för större skärmar
        sx={{ 
          height: { xs: '70%', sm: '80%' }, // Större höjd för både mobil och större skärmar
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%', // Täcker större delen av skärmens bredd inom container
            height: '100%', // Täcker större delen av skärmens höjd inom container
            padding: { xs: 4, sm: 6 }, // Justerat padding för större storlek
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}
        >
          <div className="initial-text"> {/* Initial text content */} </div>
          <Typography variant="h4" gutterBottom>
            Välkommen till Förskolekollen.se
          </Typography>
          <Typography variant="body1" paragraph>
            Här kan du hitta närliggande förskolor och se detaljerad information om dem.
            För närvarande stödjer vi bara förskolor inom stockholmsområdet
          </Typography>
          <Typography variant="body1" paragraph>
            Ange din adress i sökrutan för att börja.
          </Typography>
          <Button variant="contained" color="primary" onClick={onProceed}>
            Stäng
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
