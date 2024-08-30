import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Anpassa primär färg
    },
    secondary: {
      main: '#3f1d3b', // Anpassa sekundär färg
    },
  },
  typography: {
    fontFamily: "'Helvetica Neue', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Resten av App-komponenten */}
    </ThemeProvider>
  );
}
