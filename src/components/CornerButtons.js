import React, { useState } from 'react';
import { Button, Box,  IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService'; // Se till att AuthService är korrekt
import { useMediaQuery } from '@mui/material';

const CornerButtons = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Hämta den inloggade användaren (om det finns någon)
  const user = AuthService.getCurrentUser();

  // Kontrollera om skärmen är mindre än 600px
  const isSmallScreen = useMediaQuery('(max-width:1200px)');

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login'); // Omdirigera till inloggningssidan efter utloggning
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const renderDrawerContent = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {user ? (
          <>
            <ListItem button onClick={() => navigate(`/forskolan/${user.schoolId}`)}>
              <ListItemText primary="Min Förskola" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logga ut" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => navigate('/login')}>
              <ListItemText primary="Logga in" />
            </ListItem>
            <ListItem button onClick={() => navigate('/register')}>
              <ListItemText primary="Registrera" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 16, sm: 32 },
        left: { xs: 16, sm: 32 },
        zIndex: 1000,
      }}
    >
      {isSmallScreen ? (
        <>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {renderDrawerContent()}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {user ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/forskolan/${user.schoolId}`)}
              >
                Min Förskola
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logga ut
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
              >
                Logga in
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/register')}
              >
                Registrera
              </Button>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CornerButtons;
