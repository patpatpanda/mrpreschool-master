import React from 'react';
import { Box, Typography } from '@mui/material';

const PreschoolApplicationInfo = () => {
  return (
    <Box
      sx={{
        padding: '20px',
        maxWidth: '800px',
        margin: '10px auto 0', // Margin-top is kept as is
        textAlign: 'left',
        color: '#333',
        // Responsive styles for scroll
        '@media (max-width: 600px)': {
          maxHeight: '100vh', // Adjust max height for scrolling if needed
         
        },
      }}
    >
      <Typography variant="h4" sx={{ marginTop: '150px' }}>
        Hur ansöker man till förskola i Stockholm?
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '20px' }}>
        1. <strong>Registrera konto på Stockholms stads e-tjänst:</strong> För att ansöka om plats på en förskola måste du först skapa ett konto på Stockholms stads e-tjänst. Du loggar in med BankID eller annan e-legitimation.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '20px' }}>
        2. <strong>Sök och välj förskolor:</strong> Sök efter förskolor i ditt område och läs om olika alternativ. Du kan välja upp till fem förskolor i din ansökan, i prioriteringsordning.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '20px' }}>
        3. <strong>Skicka in ansökan:</strong> Fyll i ansökningsformuläret online med dina val av förskolor och ditt barns uppgifter. Ansökan kan skickas in när som helst under året.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '20px' }}>
        4. <strong>Väntetid och platserbjudande:</strong> Platserbjudanden sker vanligtvis baserat på kötid, barnets ålder, och ibland syskonförtur.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '20px' }}>
        5. <strong>Tacka ja till platsen:</strong> När du får ett erbjudande om plats måste du tacka ja via e-tjänsten inom den angivna svarstiden.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '20px' }}>
        6. <strong>Introduktion och start på förskolan:</strong> När du tackat ja till en plats kommer förskolan att kontakta dig för att planera introduktionen.
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: '300px', marginTop: '10px' }}>
        För mer information och för att påbörja ansökningsprocessen, besök Stockholms stads officiella webbplats för förskoleansökningar.
      </Typography>
    </Box>
  );
};

export default PreschoolApplicationInfo;
