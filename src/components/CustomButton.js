import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';  // Importera useTheme för att använda temat

const CustomButton = ({ onClick, children, isSelected = false, sx = {}, ...props }) => {  // Använd standardvärden direkt här
  const theme = useTheme();  // Hämta temat från MUI

  const buttonStyle = {
    backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.background.paper,  // Använd primary färg om vald, annars bakgrundsfärg
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,  // Använd kontrastfärgen om vald, annars vanlig textfärg
    border: isSelected ? 'none' : `2px solid ${theme.palette.divider}`,  // Divider-färgen från temat för border
    padding: '5px 10px',
    fontSize: '14px',  // Lite mindre textstorlek
    borderRadius: '25px',  // Rundade hörn
    minWidth: '120px',  // Minimum bredd
    boxShadow: theme.shadows[1],  // Lätt skugga från temat
    display: 'flex',  // Flexbox för att centrera innehåll
    alignItems: 'center',  // Vertikal centrering
    justifyContent: 'center',  // Horisontell centrering
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, border 0.3s ease, transform 0.2s ease, color 0.3s ease',  // Transition för hover-effekter
    marginTop: '10px',  // Marginal uppåt
    ...sx,  // Eventuella extra stilar från props
  };

  const hoverStyle = {
    backgroundImage: 'linear-gradient(45deg, #dd4122, #c23b1d)',  // Lägg till en gradient på hover
    transform: 'scale(1.05)',  // Skalning vid hover
    boxShadow: theme.shadows[4],  // Större skugga vid hover
    border: isSelected ? 'none' : `2px solid ${theme.palette.primary.main}`,  // Mer framträdande border
    color: theme.palette.common.white,  // Gör texten vit för bättre kontrast
  };

  const [hover, setHover] = useState(false);

  return (
    <button
      style={hover ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Lägg till prop-typer för validering
CustomButton.propTypes = {
  onClick: PropTypes.func.isRequired,  // onClick måste vara en funktion
  children: PropTypes.node.isRequired,  // children kan vara allt som kan renderas i React
  isSelected: PropTypes.bool,  // isSelected är en bool, men inte obligatorisk
  sx: PropTypes.object,  // sx är ett objekt som innehåller extra stilar
};

export default CustomButton;
