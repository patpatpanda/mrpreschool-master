import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#dd4122',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dd4122',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f4', // Bakgrundsfärg för ljust tema
      paper: '#ffffff',
    },
    text: {
      primary: '#000000', // Textfärg för ljust tema
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.cards-container': {
          backgroundColor: '#ffffff', // Vit bakgrund i ljust läge
          color: '#000000', // Svart text i ljust läge
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#dd4122',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dd4122',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212', // Bakgrundsfärg för mörkt tema
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff', // Vit text för mörkt tema
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.cards-container': {
          backgroundColor: '#1d1d1d', // Mörk bakgrund i mörkt läge
          color: '#ffffff', // Vit text i mörkt läge
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
