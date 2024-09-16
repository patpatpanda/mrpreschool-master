import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dd4122',  // Huvudfärgen, matchar den röda färgen från loggan
      contrastText: '#ffffff',  // Vit text för att kontrastera mot den röda färgen
    },
    secondary: {
      main: '#dd4122',  // Orange som en kontrastfärg om det behövs
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',  // Rundade hörn för knapparna
          textTransform: 'none',
          fontSize: '0.9rem',  // Mindre textstorlek för knappar
          padding: '6px 12px',  // Smalare padding för att passa in med små knappar
          backgroundColor: '#dd4122',  // Sätter knappens färg till den från loggan
          color: '#fff',
          '&:hover': {
            backgroundColor: '#c23b1d',  // Mörkare röd färg på hover
          },
          '@media (max-width:768px)': {
            fontSize: '0.8rem',
            padding: '5px 10px',
          },
        },
        containedPrimary: {
          backgroundColor: '#dd4122',  // Använd samma huvudfärg för primary buttons
          '&:hover': {
            backgroundColor: '#c23b1d',  // Mörkare röd på hover
          },
        },
        containedSecondary: {
          backgroundColor: '#ff9800',
          '&:hover': {
            backgroundColor: '#fb8c00',
          },
        },
      },
    },
  },
});

export default theme;
