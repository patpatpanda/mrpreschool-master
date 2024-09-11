import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #62727b 30%, #a7c0cd 90%)', // Mildare färger
  color: '#fff',
  position: 'absolute',
  top: '85px',
  left: '10px',
  zIndex: 1000,
  padding: '10px 20px',
  fontFamily: 'Nunito, sans-serif',
  border: '2px solid #455a64', // Mjukare, mer neutral kantfärg
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Lättare skugga
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #a7c0cd 30%, #62727b 90%)', // Subtil hover-effekt
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)', // Lättare hover-skugga
    transform: 'scale(1.03)', // Liten storleksökning på hover
  },
  [theme.breakpoints.up('md')]: {
    top: '40px',
    right: '40px',
    left: 'unset',
    width: '150px',
    fontSize: '0.95rem',
  },
  [theme.breakpoints.up('lg')]: {
    top: '50px',
    right: '50px',
    width: '170px',
    fontSize: '1rem',
  },
}));

export default StyledButton;
