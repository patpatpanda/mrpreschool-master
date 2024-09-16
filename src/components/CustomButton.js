import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';  // Importera useTheme för att använda temat

const CustomButton = ({ onClick, children, isSelected, sx, ...props }) => {
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
    transition: 'background-color 0.3s ease, border 0.3s ease',
    marginTop: '10px',  // Marginal uppåt
    ...sx,  // Eventuella extra stilar från props
  };

  const hoverStyle = {
    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,  // Mörkare primary färg om vald vid hover
    border: isSelected ? 'none' : `2px solid ${theme.palette.divider}`,  // Divider vid hover
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

CustomButton.defaultProps = {
  isSelected: false,  // Standardvärde för isSelected om det inte skickas in
  sx: {},  // Standardvärde för sx om inga extra stilar skickas in
};

export default CustomButton;
