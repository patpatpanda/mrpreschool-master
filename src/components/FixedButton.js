import React from 'react';
import { Button, Box } from '@mui/material';

const FixedButton = () => {
  const handleButtonClick = () => {
    window.location.href = 'https://blog.xn--frskolekollen-imb.se/'; // Länka till URL
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '10px', // Justera avståndet från toppen
        right: '10px', // Justera avståndet från höger
        zIndex: 1000, // Se till att den alltid är överst
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (max-width: 600px)': {
          top: '5px', // Anpassa position för små skärmar
          right: '5px', // Anpassa position för små skärmar
        },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        sx={{
          padding: '8px 16px',
          fontSize: '14px',
          '@media (max-width: 600px)': {
            padding: '6px 12px', // Mindre padding för små skärmar
            fontSize: '12px', // Mindre textstorlek för små skärmar
          },
        }}
      >
        Få Koll!
      </Button>
    </Box>
  );
};

export default FixedButton;
