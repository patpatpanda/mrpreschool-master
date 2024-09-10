import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const StyledBtn = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00c853 30%, #b2ff59 90%)',  // Grön till ljusgrön gradient bakgrund
  color: '#ffffff',  // Vit textfärg för kontrast
  position: 'absolute',  // Absolut position för att efterlikna den ursprungliga placeringen
  top: '80px',  // Placering från toppen
  left: '50%',  // Håll den centrerad horisontellt
  transform: 'translateX(-50%)',  // Centrerar knappen horisontellt
  zIndex: 1000,  // Se till att den visas ovanpå kartan
  padding: '10px 40px',  // Liknande padding
  width: '150px',  // Fast bredd
  fontFamily: 'Nunito, sans-serif',  // Modern font
  
  borderRadius: '12px',  // Rundade hörn
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',  // Skugga för synlighet
  border: '2px solid #00c853',  // Grön kant
  textTransform: 'none',  // Ingen versal text
  transition: 'all 0.3s ease',  // Smooth transition för alla effekter

  '&:hover': {
    background: 'linear-gradient(45deg, #b2ff59 30%, #00c853 90%)',  // Omvänd ljusgrön till grön gradient vid hover
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',  // Större skugga vid hover
  },
  
  // Responsivitet för större skärmar
  [theme.breakpoints.up('sm')]: {
    top: '110px',  // Flytta ner på mindre skärmar
  },
  [theme.breakpoints.up('md')]: {
    width: '160px',  // Större bredd för större skärmar
    fontSize: '1rem',  // Större textstorlek
  },
  [theme.breakpoints.up('lg')]: {
    top: '100px',  // Flytta upp för större skärmar
    right: 'unset',  // Behåll centrerad placering
    left: '50%',  // Behåll centrerad placering på större skärmar
    width: '180px',  // Ännu större bredd
    fontSize: '1.1rem',  // Ännu större textstorlek
  },
}));

export default StyledBtn;
