import React from 'react';
import PropTypes from 'prop-types';
import kommunalIcon from '../images/icons8-school-48.png';
import fristaendeIcon from '../images/icons8-school-64.png';
import foraldrakooperativIcon from '../images/icons8-school-building-48.png';
import customIcon from '../images/icons8-children-48.png';  // Importera din anpassade ikon
import {  Box, Button } from '@mui/material';  // Importera Button

const OrganisationFilter = ({ organisationTypes, filter, handleFilterChange, onFilterPedagogiskOmsorg }) => {
  // Funktion för att returnera ikon baserat på organisationstyp
  const getIconForType = (type) => {
    switch (type) {
      case 'Kommunal':
        return kommunalIcon;
      case 'Fristående':
        return fristaendeIcon;
      case 'Fristående (föräldrakooperativ)':
        return foraldrakooperativIcon;
      default:
        return foraldrakooperativIcon;
    }
  };

  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" gap={2}>
      {organisationTypes.map((type) => (
        <Button
          key={type}
          onClick={() => handleFilterChange(type)}  // Skicka typen direkt
          variant={filter.includes(type) ? "contained" : "outlined"}
          startIcon={<img src={getIconForType(type)} alt={`${type} ikon`} style={styles.icon} />}
          sx={{
            backgroundColor: filter.includes(type) ? '#4CAF50' : 'white',
            color: filter.includes(type) ? '#fff' : '#333',
            marginTop:'10px',
            borderRadius: '25px',
            padding: '5px 10px',
            minWidth: '55px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: filter.includes(type) ? '#45a045' : '#f5f5f5',
            },
          }}
        >
          {type}
        </Button>
      ))}

      {/* Lägg till en knapp för "Pedagogisk omsorg" med samma stil */}
      <Button
        onClick={onFilterPedagogiskOmsorg}
        variant="contained"
        startIcon={<img src={customIcon} alt="Pedagogisk omsorg ikon" style={styles.icon} />}
        sx={{
          backgroundColor: '#4CAF50',
          marginTop:'10px',
          color: '#fff',
          borderRadius: '25px',
          padding: '5px 10px',
          minWidth: '120px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#45a045',
          },
        }}
      >
        Dagmamma
      </Button>
    </Box>
  );
};

const styles = {
  icon: {
    width: '20px',  // Ställ in bildstorlek här
    height: '20px',
    marginRight: '8px',
  },
};

OrganisationFilter.propTypes = {
  organisationTypes: PropTypes.array.isRequired,
  filter: PropTypes.array.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  onFilterPedagogiskOmsorg: PropTypes.func.isRequired,
};

export default OrganisationFilter;
