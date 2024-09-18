import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { styled, keyframes } from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import myImage from '../images/seri.webp';

// Registrera diagramkomponenter för Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Keyframes för titelanimation
const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Stil för titeln med animation
const AnimatedTitle = styled(Typography)(({ theme }) => ({
  animation: `${slideIn} 1s ease-in-out`,
  fontSize: '1.5rem',
  color: '#333',
  textAlign: 'center',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5',
  },
}));

// Stil för bildcontainern med zoom-effekt
const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,

  '& img': {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    transition: 'none',
  },

  maxHeight: '300px',
  [theme.breakpoints.up('sm')]: {
    maxHeight: '400px',
  },
  [theme.breakpoints.up('md')]: {
    maxHeight: '500px',
  },
  [theme.breakpoints.up('lg')]: {
    maxHeight: '600px',
  },
  [theme.breakpoints.up('xl')]: {
    maxHeight: '800px',
  },
}));

// Stil för dialogfönstret
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    margin: 0,
    color: '#333',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textAlign: 'center',
  padding: theme.spacing(3),
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  background: theme.palette.primary.main
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2.5),
  height: 'calc(100% - 64px)',
  overflowY: 'auto',
}));

const DetailedCard = ({ schoolData, onClose }) => {
  const { namn, adress, schoolDetails, walkingTime } = schoolData;
  const bildUrl = schoolData.bildUrl;
 
  const [chartData, setChartData] = useState([]);
  const [loading] = useState(false);
  const [dataFetched] = useState(false);
  const [error, setError] = useState('');

  const years = [2023, 2022, 2021, 2020];

  const fetchData = useCallback(async () => {
    try {
      console.log(`Fetching data for school: ${namn}`);

      const dataByYear = await Promise.all(
        years.map(async (year) => {
          const encodedName = encodeURIComponent(namn);
          console.log(`Fetching data for year: ${year}`);
          const response = await axios.get(`https://masterkinder20240523125154.azurewebsites.net/api/Survey/Results/${year}/${encodedName}`);
          
          console.log(`Response for year ${year}:`, response.data);
          return response.data.$values;
        })
      );

      console.log('Data fetched for all years:', dataByYear);

      // Vi loggar strukturen för procentSvarAlternativ för varje år och fråga
      dataByYear.forEach((dataForYear, index) => {
        dataForYear.forEach((item) => {
          console.log(`Year ${years[index]} - FrageText: ${item.fragetext}`);
          console.log('ProcentSvarAlternativ:', item.procentSvarAlternativ);
        });
      });

      // Organisera data för de två frågorna
      const nojdData = years.map((year, index) => {
        const dataForYear = dataByYear[index].find(item => item.fragetext === 'Jag är som helhet nöjd med mitt barns förskola');
        if (dataForYear) {
          const procentSvar = dataForYear.procentSvarAlternativ?.$values || [];
          console.log(`ProcentSvar for "Jag är som helhet nöjd" in year ${year}:`, procentSvar);
          // Vi hämtar procenten för svarsalternativ 5 (de positiva svaren)
          const positivtSvar = procentSvar.find(svar => svar.svarsalternativ === 5);
          return positivtSvar ? positivtSvar.procent : 0;
        }
        return 0;
      });

      const rekommenderaData = years.map((year, index) => {
        const dataForYear = dataByYear[index].find(item => item.fragetext === 'Jag kan rekommendera mitt barns förskola');
        if (dataForYear) {
          const procentSvar = dataForYear.procentSvarAlternativ?.$values || [];
          console.log(`ProcentSvar for "Jag kan rekommendera" in year ${year}:`, procentSvar);
          // Vi hämtar procenten för svarsalternativ 5 (de positiva svaren)
          const positivtSvar = procentSvar.find(svar => svar.svarsalternativ === 5);
          return positivtSvar ? positivtSvar.procent : 0;
        }
        return 0;
      });

      console.log('nojdData:', nojdData);
      console.log('rekommenderaData:', rekommenderaData);

      setChartData({
        labels: years,
        datasets: [
          {
            label: 'Jag är som helhet nöjd med mitt barns förskola',
            data: nojdData,
            backgroundColor: 'rgba(46, 204, 113, 0.6)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1,
          },
          {
            label: 'Jag kan rekommendera mitt barns förskola',
            data: rekommenderaData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Kunde inte hämta data.');
    }
  }, [namn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const isAbsoluteUrl = (url) => /^(?:[a-z]+:)?\/\//i.test(url);
  const imageUrl = bildUrl && isAbsoluteUrl(bildUrl) ? bildUrl : myImage;

  return (
    <StyledDialog open onClose={onClose} fullWidth fullScreen maxWidth="md">
      <StyledDialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: { xs: 8, sm: 8 },
            top: { xs: 8, sm: 8 },
            color: '#fff',
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        {/* Kreativ titel med animation */}
        <AnimatedTitle>{namn}</AnimatedTitle>

        {/* Bild med zoom-effekt vid hover */}
        <ImageContainer>
          <img src={imageUrl} alt={`${namn}`} />
        </ImageContainer>

        {schoolDetails?.beskrivning && (
          <Box mb={4}>
            <Typography variant="h6" sx={{ color: '#333', marginBottom: '8px' }}>
              Beskrivning
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
              {schoolDetails.beskrivning}
            </Typography>
          </Box>
        )}

        {walkingTime && (
          <Typography variant="body2" sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', color: '#555', zIndex: 3000 }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', color: '#4CAF50' }} /> Beräknad gångtid: {walkingTime} minuter
          </Typography>
        )}

        {adress && (
          <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#333', zIndex: 3000 }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#4CAF50' }} /> {adress}
          </Typography>
        )}

        <Grid container spacing={2}>
          {schoolDetails && (
            <Grid item xs={12} md={6} sx={{ zIndex: 3000 }}>
              <Box>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Skoldetaljer</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Typ av Service: {schoolDetails.typAvService}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Verksam i: {schoolDetails.verksamI}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Organisationsform: {schoolDetails.organisationsform}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Antal Barn: {schoolDetails.antalBarn}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Antal Barn per Årsarbetare: {schoolDetails.antalBarnPerArsarbetare}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Andel Legitimerade Förskollärare: {schoolDetails.andelLegitimeradeForskollarare}%</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Inriktning och Profil: {schoolDetails.inriktningOchProfil}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Kost och Måltider: {schoolDetails.kostOchMaltider}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Inne och Utemiljö: {schoolDetails.inneOchUtemiljo}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>Mål och Vision: {schoolDetails.malOchVision}</Typography>
                <Typography variant="body2">Webbplats: <a href={schoolDetails.webbplats} target="_blank" rel="noopener noreferrer">{schoolDetails.webbplats}</a></Typography>
              </Box>
            </Grid>
          )}

          {schoolDetails?.kontakter?.$values && schoolDetails.kontakter.$values.length > 0 && (
            <Grid item xs={12} sx={{ zIndex: 3000 }}>
              <Typography variant="h6">Kontaktinformation</Typography>
              {schoolDetails.kontakter.$values.map((kontakt, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body2">{kontakt.namn}</Typography>
                  <Typography variant="body2">{kontakt.roll}</Typography>
                  <Typography variant="body2">{kontakt.epost}</Typography>
                  <Typography variant="body2">{kontakt.telefon}</Typography>
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
        {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
  <Box sx={{ width: '100%', maxWidth: '800px', margin: '40px auto' }}>
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#333',
              font: {
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: 'Föräldrar som svarat "Instämmer helt"',
            color: '#333',
            font: {
              size: 18,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#333',
            },
          },
          y: {
            ticks: {
              color: '#333',
              callback: function (value) {
                return value + '%';
              },
            },
            beginAtZero: true,
            max: 100,
          },
        },
      }}
      height={400}
    />
  </Box>
) : (
  <Typography variant="body2">{error || 'Laddar...'}</Typography>
)}

        {error && <Typography variant="body2" sx={{ color: 'red', marginTop: '50px', zIndex: 3000 }}>{error}</Typography>}
        {dataFetched && chartData.length === 0 && !loading && (
          <Typography variant="body2" sx={{ color: '#333', zIndex: 3000 }}>Ingen data tillgänglig</Typography>
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
    walkingTime: PropTypes.string,
    bildUrl: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedCard;

