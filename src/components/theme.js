import { createTheme } from '@mui/material/styles';
import { pink, yellow, blueGrey, deepOrange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: pink[400],
    },
    secondary: {
      main: pink[400],
    },
    background: {
      default: yellow[50],
    },
    text: {
      primary: blueGrey[900], // Mörkare färg för bättre kontrast
      secondary: blueGrey[600], // Mjukare sekundärfärg
    },
  },
  typography: {
    fontFamily: 'Comic Sans MS, Comic Sans',
    h1: {
      fontSize: '4rem', // Större rubrikstorlek
      fontWeight: 'bold',
      color: pink[500],
      '@media (max-width:600px)': {
        fontSize: '3rem', // Justera för mindre skärmar
      },
    },
    h3: {
      fontSize: '2rem', // Ökad storlek
      color: pink[500],
    },
    body1: {
      fontSize: '1.25rem', // Större brödtext
      color: blueGrey[800], // Använd primary textfärg
      '@media (max-width:600px)': {
        fontSize: '1rem', // Justera för mindre skärmar
      },
    },
    body2: {
      fontSize: '1rem', // Ökad storlek
      color: blueGrey[700], // Använd secondary textfärg
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          fontSize: '1rem', // Större standardstorlek för desktop
          padding: '8px 16px', // Ökad padding för desktop
          '@media (max-width:768px)': {
            fontSize: '0.9rem', // Justera för mindre skärmar
            padding: '7px 14px',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          margin: 0,
          fontFamily: 'Comic Sans MS, Comic Sans',
          color: blueGrey[900], // Använd primary textfärg som standard
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFEB3B',
          color: deepOrange[900], // Mörkare färg för bättre kontrast
          textAlign: 'center',
          fontSize: '1.75rem', // Större dialogtitel
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFDE7',
          color: blueGrey[800], // Använd primary textfärg
          fontSize: '1.25rem', // Större dialogtext
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          fontSize: '1.5rem', // Större ikonknappar
        },
      },
    },
  },
});

export default theme;
