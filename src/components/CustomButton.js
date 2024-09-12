import React, { useState } from 'react';

const CustomButton = ({ onClick, children, isSelected, sx, ...props }) => {
  const buttonStyle = {
    backgroundColor: isSelected ? '#4CAF50' : 'white',  // Grön om vald, annars vit
    color: isSelected ? '#fff' : '#333',  // Vit text om vald, annars svart
    border: isSelected ? 'none' : '2px solid #ccc',  // Border när ej vald
    padding: '5px 10px',
    fontSize: '14px',  // Lite mindre textstorlek
    borderRadius: '25px',  // Rundade hörn
    minWidth: '120px',  // Minimum bredd
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',  // Lätt skugga
    display: 'flex',  // Flexbox för att centrera innehåll
    alignItems: 'center',  // Vertikal centrering
    justifyContent: 'center',  // Horisontell centrering
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, border 0.3s ease',
    marginTop: '10px',  // Marginal uppåt
    ...sx,  // Eventuella extra stilar från props
  };

  const hoverStyle = {
    backgroundColor: isSelected ? '#45a045' : '#f5f5f5',  // Mörkare grön om vald vid hover
    border: isSelected ? 'none' : '2px solid #ccc',  // Border vid hover
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

export default CustomButton;
