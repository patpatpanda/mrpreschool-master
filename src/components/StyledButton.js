import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// Skapa en styled komponent för knappen
const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',  // Vit till ljusgrå gradient bakgrund
  color: '#333',  // Mörkare textfärg för kontrast mot den ljusa bakgrunden
  position: 'absolute',  // Fixerad position för att knappen ska vara i hörnet
  top: '85px',  // Placering från toppen
  left: '10px',  // Placering från vänsterkanten på mindre skärmar
  zIndex: 9999,  // Hög z-index för att den ska synas över allt
  padding: '12px 24px',  // Ökad padding för en lyxigare känsla
  fontFamily: 'Nunito, sans-serif',  // Modern font
   border: '2px solid #333',
  borderRadius: '12px',  // Rundade hörn
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',  // Lättare skugga för att matcha den ljusa bakgrunden
  textTransform: 'none',  // Ingen versal text
  transition: 'all 0.3s ease',  // Smooth transition för alla effekter
  '&:hover': {
    background: 'linear-gradient(45deg, #e0e0e0 30%, #f5f5f5 90%)',  // Omvänd vit till grå gradient vid hover
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',  // Större skugga vid hover
    transform: 'scale(1.05)',  // Liten skalning vid hover
  },
  // Responsivitet för större skärmar
  [theme.breakpoints.up('md')]: {
    top: '40px',  // Flytta längre ned på större skärmar
    right: '40px',  // Flytta till höger för större skärmar
    left: 'unset',  // Ta bort vänster placering på större skärmar
    width: '160px',  // Större bredd för knappen på större skärmar
    fontSize: '1rem',  // Större textstorlek på större skärmar
  },
  [theme.breakpoints.up('lg')]: {
    top: '60px',  // Ännu längre ned för mycket stora skärmar
    right: '60px',  // Flytta längre bort från högerkanten
    width: '180px',  // Ännu större bredd för mycket stora skärmar
    fontSize: '1.1rem',  // Ännu större textstorlek
  },
}));

export default StyledButton;
