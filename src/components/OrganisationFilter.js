import React from 'react';
import PropTypes from 'prop-types';

const OrganisationFilter = ({ organisationTypes, filter, handleFilterChange, visible }) => {
  if (!visible) {
    return null; // Om komponenten inte är synlig, returnera null för att inte rendera något
  }

  // Funktion för att returnera färg baserat på organisationstyp
   const getColorForType = (type) => {
    switch (type) {
      case 'Kommunal':
        return '#FFA500'; // Orange
      case 'Fristående':
        return '#FF69B4'; // Gul
      case 'Fristående (föräldrakooperativ)':
        return '#3366FF'; // Röd
      default:
        return '#000'; // Standardfärg (svart)
    }
  };

  return (
    <div style={styles.container}>
      {organisationTypes.map((type) => (
        <label key={type} style={{ ...styles.label, color: getColorForType(type) }}>
          <input
            type="checkbox"
            value={type}
            checked={filter.includes(type)}
            onChange={handleFilterChange}
            style={styles.checkbox}
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
};

OrganisationFilter.propTypes = {
  organisationTypes: PropTypes.array.isRequired,
  filter: PropTypes.array.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default OrganisationFilter;
