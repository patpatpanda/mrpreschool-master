import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material/styles';
import myImage from '../images/seri.webp'; // Importera din standardbild

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    [theme.breakpoints.up('md')]: {
      maxWidth: '900px',
      margin: '0 auto',
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: '#ffffff',
  textAlign: 'center',
  padding: '16px',
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 'bold',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: '20px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto 20px auto',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  img: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
    maxHeight: '400px',
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: theme.shadows[1],
  marginBottom: '20px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const DetailedCard = ({ schoolData, onClose }) => {
  const { namn, adress, malibuData, schoolDetails, description, walkingTime } = schoolData;
  const bildUrl = schoolData.bildUrl;

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
        {walkingTime && (
          <Typography variant="body2" sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', color: '#555' }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', color: '#4CAF50' }} /> Beräknad gångtid: {walkingTime} minuter
          </Typography>
        )}
        {adress && (
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#4CAF50' }} /> {adress}
          </Typography>
        )}
        <Grid container spacing={2}>
          {malibuData && (
            <Grid item xs={12} md={6}>
              <InfoBox>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Föräldraomdömen</Typography>
                <Typography variant="body2">Helhetsomdöme: {malibuData.helhetsomdome}%</Typography>
                <Typography variant="body2">Svarsfrekvens: {malibuData.svarsfrekvens}%</Typography>
                <Typography variant="body2">Antal Svar: {malibuData.antalSvar}</Typography>
                {malibuData.questions && malibuData.questions.$values && (
                  <Box mt={2}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Frågor</Typography>
                    {malibuData.questions.$values.map((question, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="body2">Fråga: {question.frageText}</Typography>
                        <Typography variant="body2">Andel Instämmer: {question.andelInstammer}%</Typography>
                       
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
              </InfoBox>
            </Grid>
          )}
          {schoolDetails && (
            <Grid item xs={12} md={6}>
              <InfoBox>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Skoldetaljer</Typography>
                <Typography variant="body2">Typ av Service: {schoolDetails.typAvService}</Typography>
                <Typography variant="body2">Verksam i: {schoolDetails.verksamI}</Typography>
                <Typography variant="body2">Organisationsform: {schoolDetails.organisationsform}</Typography>
                <Typography variant="body2">Antal Barn: {schoolDetails.antalBarn}</Typography>
                <Typography variant="body2">Antal Barn per Årsarbetare: {schoolDetails.antalBarnPerArsarbetare}</Typography>
                <Typography variant="body2">Andel Legitimerade Förskollärare: {schoolDetails.andelLegitimeradeForskollarare}%</Typography>
                <Typography variant="body2">Inriktning och Profil: {schoolDetails.inriktningOchProfil}</Typography>
                <Typography variant="body2">Mer om Oss: {schoolDetails.merOmOss}</Typography>
                <Typography variant="body2">Webbplats: <a href={schoolDetails.webbplats} target="_blank" rel="noopener noreferrer">{schoolDetails.webbplats}</a></Typography>
              </InfoBox>
            </Grid>
          )}
          {schoolDetails && schoolDetails.kontakter && schoolDetails.kontakter.$values && schoolDetails.kontakter.$values.length > 0 && (
            <Grid item xs={12}>
              <InfoBox>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Kontaktinformation</Typography>
                {schoolDetails.kontakter.$values.map((kontakt, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="body2">Namn: {kontakt.namn}</Typography>
                    <Typography variant="body2">Roll: {kontakt.roll}</Typography>
                    <Typography variant="body2">E-post: {kontakt.epost}</Typography>
                    <Typography variant="body2">Telefon: {kontakt.telefon}</Typography>
                  </Box>
                ))}
              </InfoBox>
            </Grid>
          )}
        </Grid>
        {description && (
          <InfoBox sx={{ marginTop: '20px' }}>
            <Typography variant="body2" sx={{ color: '#333' }}>{description}</Typography>
          </InfoBox>
        )}
      </StyledDialogContent>
    </StyledDialog>
  );
};

DetailedCard.propTypes = {
  schoolData: PropTypes.shape({
    namn: PropTypes.string.isRequired,
    adress: PropTypes.string,
    malibuData: PropTypes.object,
    schoolDetails: PropTypes.object,
    description: PropTypes.string,
    walkingTime: PropTypes.string,
    bildUrl: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedCard;
