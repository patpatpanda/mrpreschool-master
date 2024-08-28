import { createTheme } from '@mui/material/styles';
import { yellow, blueGrey, deepOrange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#fff', 
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
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: '#1a73e8',
      '@media (max-width:600px)': {
        fontSize: '3rem',
      },
    },
    h3: {
      fontSize: '2rem',
      color: '#1a73e8',
    },
    body1: {
      fontSize: '1.25rem',
      color: blueGrey[800],
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '1rem',
      color: blueGrey[700],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          fontSize: '1rem',
          padding: '8px 16px',
          '@media (max-width:768px)': {
            fontSize: '0.9rem',
            padding: '7px 14px',
          },
        },
        dark: {
          // Skapa en ny stil för den mörka knappen
          backgroundColor: '#333',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#555',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          margin: 0,
          fontFamily: 'Roboto, sans-serif',
          color: blueGrey[900],
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFEB3B',
          color: deepOrange[900],
          textAlign: 'center',
          fontSize: '1.75rem',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFDE7',
          color: blueGrey[800],
          fontSize: '1.25rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          fontSize: '1.5rem',
        },
      },
    },
  },
});

export default theme;
