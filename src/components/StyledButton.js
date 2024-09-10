import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// Skapa en styled komponent för knappen
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',  // Vit bakgrund för icke-aktiv knapp
  color: '#333',  // Mörk textfärg för läsbarhet
  position: 'absolute',  // Fixed position för att knappen ska vara i hörnet
  top: '60px',  // Placering från toppen för mobiler
  left: '10px',   // Placering från vänsterkanten
  zIndex: 9999,  // Mycket högt z-index för att säkerställa att den visas över alla element
  padding: '10px 20px',
  fontFamily: 'Nunito, sans-serif',
  border: '2px solid #333',  // Fullständig definition av kantlinje
  borderRadius: '8px',  // Rundade hörn
  boxShadow: 'none',  // Ingen skugga för knappen
  width: '80px',  // Fast bredd för mobiler
  fontSize: '0.85rem',  // Fast textstorlek
  '&:hover': {
    backgroundColor: 'lightgrey',  // Ljusare bakgrund vid hover
  },
  // Responsivitet för större skärmar
  [theme.breakpoints.up('md')]: {
    top: '40px',  // Flytta längre ned på större skärmar
    right: '40px',  // Flytta till höger för större skärmar
    width: '120px',  // Större bredd för knappen på större skärmar
    fontSize: '1rem',  // Större textstorlek på större skärmar
  },
  [theme.breakpoints.up('lg')]: {
    top: '60px',  // Ännu längre ned för mycket stora skärmar
    right: '60px',  // Flytta längre bort från högerkanten
    width: '140px',  // Ännu större bredd för mycket stora skärmar
    fontSize: '1.1rem',  // Ännu större textstorlek
  },
}));

export default StyledButton;
