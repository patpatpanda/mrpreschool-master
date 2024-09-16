import React from 'react';
import { Checkbox, MenuItem, Select, InputLabel, FormControl, ListItemText, Box } from '@mui/material';
import kommunalIcon from '../images/icons8-school-48.png';
import fristaendeIcon from '../images/icons8-school-64.png';
import foraldrakooperativIcon from '../images/icons8-school-building-48.png';
import customIcon from '../images/icons8-children-48.png'; // Anpassad ikon

const OrganisationFilterDropdown = ({ organisationTypes, filter, handleFilterChange }) => {
  // Funktion för att hämta rätt ikon baserat på organisationstyp
  const getIconForType = (type) => {
    switch (type) {
      case 'Kommunal':
        return kommunalIcon;
      case 'Fristående':
        return fristaendeIcon;
      case 'Fristående (föräldrakooperativ)':
        return foraldrakooperativIcon;
      default:
        return customIcon; // Default anpassad ikon
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <InputLabel id="organisation-filter-label">Organisationstyp</InputLabel>
      <Select
        labelId="organisation-filter-label"
        id="organisation-filter"
        multiple
        value={filter}
        renderValue={(selected) => selected.join(', ')}
        sx={{
          backgroundColor: 'white',  // Vit bakgrund för dropdown
          '&:hover': {
            backgroundColor: '#f5f5f5',  // Ljusare grå bakgrund vid hover
          },
        }}
      >
        {organisationTypes.map((type) => (
          <MenuItem 
            key={type} 
            value={type}
            sx={{ 
              backgroundColor: 'white',  // Vit bakgrund för varje menyartikel
              '&:hover': {
                backgroundColor: '#f5f5f5',  // Ljusare bakgrund vid hover på menyartiklar
              },
            }}
          >
            <Checkbox
              checked={filter.includes(type)}
              onChange={() => handleFilterChange(type)}
            />
            {/* Lägger till en ikon bredvid organisationstypens namn */}
            <Box display="flex" alignItems="center" gap={1}>
              <img src={getIconForType(type)} alt={`${type} ikon`} style={styles.icon} />
              <ListItemText primary={type} />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const styles = {
  icon: {
    width: '20px',  // Ikonens storlek
    height: '20px',
    marginRight: '8px',
  },
};

export default OrganisationFilterDropdown;
