import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green for primary actions
      contrastText: '#ffffff', // White text on primary buttons
    },
    secondary: {
      main: '#ff9800', // Orange for secondary actions
      contrastText: '#ffffff', // White text for secondary buttons
    },
    background: {
      default: '#f5f5f5', // Light gray background
    },
    text: {
      primary: '#333333', // Dark gray text for primary
      secondary: '#666666', // Medium gray text for secondary
    },
  },
  typography: {
    fontFamily: 'Nunito, sans-serif', // Global font
    h1: {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: '#4caf50', // Updated to green
      '@media (max-width:600px)': {
        fontSize: '3rem',
      },
    },
    h3: {
      fontSize: '2rem',
      color: '#4caf50', // Updated to green
    },
    body1: {
      fontSize: '1.25rem',
      color: '#333333', // Updated to dark gray
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '1rem',
      color: '#666666', // Updated to medium gray
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          fontSize: '1rem',
          padding: '10px 20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          '@media (max-width:768px)': {
            fontSize: '0.8rem',
            padding: '7px 14px',
          },
        },
        containedPrimary: {
          backgroundColor: '#fff', // Green
          color: '#333',
          '&:hover': {
            backgroundColor: 'lightgray', // Darker green on hover
          },
        },
        containedSecondary: {
          backgroundColor: '#fff', // Orange
          color: '#333',
          '&:hover': {
            backgroundColor: 'lightgray', // Darker orange on hover
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          overflow: 'hidden',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#bdbdbd',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#333', // Dark gray background
          color: 'white',
          borderRadius: '50%',
          padding: '10px',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#66bb6a', // Lighter green on hover
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
  },
});

export default theme;
