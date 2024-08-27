import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material/styles';
import myImage from '../images/seri.webp';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    width: '100%',
    height: '100%',
    margin: 0,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: '#3f1d3ba3',
  color: '#ffffff',
  textAlign: 'center',
  padding: '16px',
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 'bold',
  position: 'relative',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: '20px',
  height: 'calc(100% - 64px)',
  overflowY: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  position: 'relative',
  marginTop: '20px',
  marginBottom: '20px',

  img: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    maxHeight: '400px',
    [theme.breakpoints.up('md')]: {
      maxHeight: '500px',
      maxWidth: '50%',
    },
    [theme.breakpoints.up('lg')]: {
      maxHeight: '600px',
      maxWidth: '50%',
    },
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
    transition: 'opacity 0.5s ease',
    opacity: 0,
  },
}));

const DetailedCard = ({ schoolData, onClose }) => {
  const { namn, adress, malibuData, schoolDetails, walkingTime, bildUrl } = schoolData;

  useEffect(() => {
    console.log('DetailedCard mounted with schoolData:', schoolData);
  }, [schoolData]);

  const isAbsoluteUrl = (url) => /^(?:[a-z]+:)?\/\//i.test(url);
  const imageUrl = bildUrl && isAbsoluteUrl(bildUrl) ? bildUrl : myImage;

  return (
    <StyledDialog
      open
      onClose={onClose}
      fullWidth
      fullScreen
      maxWidth="md"
    >
      <StyledDialogTitle>
        {namn}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#ffffff' }}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </StyledDialogTitle>
      <StyledDialogContent>
        <ImageContainer>
          <img src={imageUrl} alt={`${namn}`} />
        </ImageContainer>

        {schoolDetails.beskrivning && (
          <Box mb={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}></Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>
              {schoolDetails.beskrivning}
            </Typography>
          </Box>
        )}

        <Divider sx={{ marginBottom: '20px' }} />

        {walkingTime && (
          <Typography variant="body2" sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', color: '#555' }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', color: '#4CAF50' }} /> Beräknad gångtid: {walkingTime} minuter
          </Typography>
        )}

        {adress && (
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#333', marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#4CAF50' }} /> {adress}
          </Typography>
        )}

        <Grid container spacing={4}>
          {malibuData && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}>Föräldraomdömen</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Helhetsomdöme: {malibuData.helhetsomdome}%</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Svarsfrekvens: {malibuData.svarsfrekvens}%</Typography>
                <Typography variant="body2" sx={{ marginBottom: '16px' }}>Antal Svar: {malibuData.antalSvar}</Typography>

                {malibuData.questions && malibuData.questions.$values && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Frågor</Typography>
                    {malibuData.questions.$values.map((question, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="body2" sx={{ marginBottom: '4px' }}>Fråga: {question.frageText}</Typography>
                        {question.frageText.includes('HELHETSOMDÖME') && (
                          <Typography variant="body2">
                            Här ser vi att {question.andelInstammer}% av de tillfrågade är nöjda med förskolans helhetsintryck.
                          </Typography>
                        )}
                        {question.frageText.includes('UTVECKLING OCH LÄRANDE') && (
                          <Typography variant="body2">
                            Resultatet visar att {question.andelInstammer}% av föräldrarna upplever att deras barn utvecklas och lär sig bra.
                          </Typography>
                        )}
                        {question.frageText.includes('NORMER OCH VÄRDEN') && (
                          <Typography variant="body2">
                            Frågan om normer och värden visar att {question.andelInstammer}% av de svarande instämmer i att förskolan arbetar väl med dessa aspekter.
                          </Typography>
                        )}
                        {question.frageText.includes('SAMVERKAN MED HEMMET') && (
                          <Typography variant="body2">
                            Denna fråga belyser samverkan med hemmet. Här ser vi att {question.andelInstammer}% av föräldrarna tycker att samarbetet med förskolan fungerar bra.
                          </Typography>
                        )}
                        {question.frageText.includes('KOST, RÖRELSE OCH HÄLSA') && (
                          <Typography variant="body2">
                            {question.andelInstammer}% är nöjda med förskolans arbete inom dessa områden.
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          )}

          {schoolDetails && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}>Skoldetaljer</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Typ av Service: {schoolDetails.typAvService}</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Verksam i: {schoolDetails.verksamI}</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Organisationsform: {schoolDetails.organisationsform}</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Antal Barn: {schoolDetails.antalBarn}</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Antal Barn per Årsarbetare: {schoolDetails.antalBarnPerArsarbetare}</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Andel Legitimerade Förskollärare: {schoolDetails.andelLegitimeradeForskollarare}%</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Inriktning och Profil: {schoolDetails.inriktningOchProfil}</Typography>
                {schoolDetails.merOmOss && (
                  <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                    Mer om oss: {schoolDetails.merOmOss}
                  </Typography>
                )}
              </Box>
            </Grid>
          )}

          {schoolDetails && schoolDetails.kontakter && schoolDetails.kontakter.$values && schoolDetails.kontakter.$values.length > 0 && (
            <Grid item xs={12}>
              <Box mt={4}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}>Kontaktinformation</Typography>
                {schoolDetails.kontakter.$values.map((kontakt, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="body2" sx={{ marginBottom: '4px' }}>Namn: {kontakt.namn}</Typography>
                    <Typography variant="body2" sx={{ marginBottom: '4px' }}>Roll: {kontakt.roll}</Typography>
                    <Typography variant="body2" sx={{ marginBottom: '4px' }}>E-post: {kontakt.epost}</Typography>
                    <Typography variant="body2">Telefon: {kontakt.telefon}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </StyledDialogContent>
    </StyledDialog>
  );
};

DetailedCard.propTypes = {
  schoolData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedCard;
