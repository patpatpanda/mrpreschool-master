import React from 'react';
import PropTypes from 'prop-types';
import kommunalIcon from '../images/icons8-school-48.png';
import fristaendeIcon from '../images/icons8-school-64.png';
import foraldrakooperativIcon from '../images/icons8-school-building-48.png';
import { IconButton, Tooltip, Box } from '@mui/material';  // Importera IconButton, Tooltip, och Box
import ChildCareIcon from '@mui/icons-material/ChildCare';  // Importera en lämplig ikon

const OrganisationFilter = ({ organisationTypes, filter, handleFilterChange, visible, onFilterPedagogiskOmsorg }) => {
  if (!visible) {
    return null; // Om komponenten inte är synlig, returnera null för att inte rendera något
  }

  // Funktion för att returnera ikon baserat på organisationstyp
  const getIconForType = (type) => {
    switch (type) {
      case 'Kommunal':
        return kommunalIcon; // Ikon för Kommunal
      case 'Fristående':
        return fristaendeIcon; // Ikon för Fristående
      case 'Fristående (föräldrakooperativ)':
        return foraldrakooperativIcon; // Ikon för Fristående (föräldrakooperativ)
      default:
        return foraldrakooperativIcon; // Standardikon
    }
  };

  return (
    <div style={styles.container}>
      {organisationTypes.map((type) => (
        <label key={type} style={styles.label}>
          <input
            type="checkbox"
            value={type}
            checked={filter.includes(type)}
            onChange={handleFilterChange}
            style={styles.checkbox}
          />
          <img
            src={getIconForType(type)} // Använd rätt bild här
            alt={`${type} ikon`}
            style={styles.icon} // Style för bilder
          />
          {type}
        </label>
      ))}

      {/* Lägg till en ikon och text för att filtrera "Pedagogisk omsorg" */}
      <Box display="flex" alignItems="center" marginTop="10px" style={styles.label}>
        <Tooltip title="Visa endast Pedagogisk omsorg">  {/* Tooltip för att förklara ikonen */}
          <IconButton
            onClick={onFilterPedagogiskOmsorg}
            sx={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#45a045',
              },
              marginRight: '8px',
            }}
          >
            <ChildCareIcon />  {/* Byt till den ikon du vill använda */}
          </IconButton>
        </Tooltip>
        {/* Texten "Dagmamma" med samma stil som övrig text */}
        <span style={styles.labelText}>Dagmamma</span>
      </Box>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  label: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelText: {
    fontSize: '16px', // Matchar storleken på organisationstypernas text
    color: '#333',    // Matchar textfärgen
    marginLeft: '8px',  // Avstånd mellan ikon och text
  },
  checkbox: {
    marginRight: '8px',
  },
  icon: {
    width: '20px', // Ställ in bildstorlek här
    height: '20px',
    marginRight: '8px',
  },
};

OrganisationFilter.propTypes = {
  organisationTypes: PropTypes.array.isRequired,
  filter: PropTypes.array.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onFilterPedagogiskOmsorg: PropTypes.func.isRequired, // Ny prop för ikonen
};

export default OrganisationFilter;
