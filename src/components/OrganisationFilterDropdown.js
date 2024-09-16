import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, MenuItem, Select, FormControl, Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Stängningsikon
import CustomButton from './CustomButton'; // Importera din CustomButton
import kommunalIcon from '../images/icons8-school-48.png';
import fristaendeIcon from '../images/icons8-school-64.png';
import foraldrakooperativIcon from '../images/icons8-school-building-48.png';
import customIcon from '../images/icons8-children-48.png'; // Anpassad ikon

const OrganisationFilterDropdown = ({ organisationTypes, filter, handleFilterChange }) => {
  const [open, setOpen] = useState(false);

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

  // Hantera öppning/stängning av dropdown
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      {/* Använd CustomButton istället för vanlig Button */}
      <CustomButton onClick={handleOpen} isSelected={open}>
        Organisationstyp
      </CustomButton>

      {/* Modal som öppnar dropdown i mitten av skärmen */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="organisation-filter-modal"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginTop: '100px', // Positionera modalen 100px från toppen
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: '300px',  // Bredd på boxen
            maxWidth: '400px',
            outline: 'none',
            position: 'relative',  // För positionering av stängningsknappen
          }}
        >
          {/* Stängningsknapp */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: '1px',
              right: '8px',
              color: '#333',
              '&:hover': {
                color: '#ff0000',  // Ändra färg vid hover
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Select
  multiple
  value={filter}
  renderValue={(selected) => selected.join(', ')}
  sx={{
    width: '100%',  // Full bredd på dropdown
    backgroundColor: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',  // Ta bort bordern
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',  // Ingen border vid hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',  // Ingen border vid fokus
    },
    '&:hover': {
      backgroundColor: '#f5f5f5',  // Ljusare grå bakgrund vid hover
    },
  }}
>

            {organisationTypes.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={filter.includes(type)} onChange={() => handleFilterChange(type)} />
                <Box display="flex" alignItems="center" gap={1}>
                  <img src={getIconForType(type)} alt={`${type} ikon`} style={styles.icon} />
                  {type}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Modal>
    </FormControl>
  );
};

const styles = {
  icon: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  },
};

// Lägg till PropTypes för att validera props
OrganisationFilterDropdown.propTypes = {
  organisationTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  filter: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default OrganisationFilterDropdown;
