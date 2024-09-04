import React from 'react';
import PropTypes from 'prop-types';
import kommunalIcon from '../images/icons8-school-48.png';
import fristaendeIcon from '../images/icons8-school-64.png';
import foraldrakooperativIcon from '../images/icons8-school-building-48.png';

const OrganisationFilter = ({ organisationTypes, filter, handleFilterChange, visible }) => {
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
};

export default OrganisationFilter;
