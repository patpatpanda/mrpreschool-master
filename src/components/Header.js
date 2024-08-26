// src/components/Header.js
import React from 'react';

const Header = () => {
  // Funktion för att navigera användaren till den specifika URL:en
  const handleClick = () => {
    window.location.href = 'https://xn--frskolekollen-imb.se/';
  };

  return (
    <div className="header-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="initial-text"></div>
    </div>
  );
};

export default Header;
