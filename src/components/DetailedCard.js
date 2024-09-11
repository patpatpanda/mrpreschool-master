import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

// Keyframes för zoom in/zoom out


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
    transition: 'none', // Ingen transitionseffekt längre
  },

  // Standardhöjd för mobila enheter
  maxHeight: '300px',

  // Anpassa höjden för större skärmar med breakpoints
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
  padding: theme.spacing(2),
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  background: 'linear-gradient(45deg, #62727b 30%, #a7c0cd 90%)', // Mildare färger
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2.5),
  height: 'calc(100% - 64px)',
  overflowY: 'auto',
}));

const DetailedCard = ({ schoolData, onClose }) => {
  const { namn, adress, malibuData, schoolDetails, walkingTime } = schoolData;
  const bildUrl = schoolData.bildUrl;

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [error, setError] = useState('');

  const years = [2023, 2022, 2021, 2020];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    setDataFetched(false);

    try {
      const allChartData = await Promise.all(
        years.map(async (year) => {
          try {
            const encodedName = encodeURIComponent(namn);
            const response = await axios.get(`https://masterkinder20240523125154.azurewebsites.net/api/Survey/Results/${year}/${encodedName}`);
            const responseData = response.data;

            if (!responseData || !responseData.$values || responseData.$values.length === 0) {
              return null;
            }

            const filteredData = responseData.$values.filter(item => item.forskoleverksamhet === namn);

            if (filteredData.length > 0) {
              const procentSvarAlternativ = filteredData[0].procentSvarAlternativ;
              const procentArray = Array.isArray(procentSvarAlternativ) ? procentSvarAlternativ : procentSvarAlternativ.$values || [];

              const labels = procentArray.map(item => translateSvarsalternativ(item.svarsalternativ));
              const dataValues = procentArray.map(item => item.procent);

              const totalSvar = filteredData[0].totalSvar;

              return {
                year,
                data: {
                  labels: labels,
                  datasets: [
                    {
                      label: `Totalt antal svar: ${totalSvar}`,
                      data: dataValues,
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(153, 102, 255, 1)'
                      ],
                      borderWidth: 1
                    }
                  ]
                }
              };
            } else {
              return null;
            }
          } catch (error) {
            return null;
          }
        })
      );

      setChartData(allChartData.filter(data => data !== null));
      setDataFetched(true);
    } catch (err) {
      setError('Ett oväntat fel inträffade.');
    } finally {
      setLoading(false);
    }
  }, [namn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const translateSvarsalternativ = useMemo(() => (svarsalternativ) => {
    const mapping = {
      "1": "Instämmer inte alls",
      "2": "Instämmer i liten utsträckning",
      "3": "Instämmer till viss del",
      "4": "Instämmer i stor utsträckning",
      "5": "Instämmer helt",
      "Vet ej": "Vet ej",
      "Övrig": "Övrig"
    };

    return mapping[svarsalternativ] || svarsalternativ;
  }, []);

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

        {schoolDetails.beskrivning && (
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
          {malibuData && (
            <Grid item xs={12} md={6} sx={{ zIndex: 3000 }}>
              <Box>
                <Typography variant="h6" sx={{ }}>Föräldraomdömen</Typography>
                <Typography variant="body2">Helhetsomdöme: {malibuData.helhetsomdome}%</Typography>
                <Typography variant="body2">Svarsfrekvens: {malibuData.svarsfrekvens}%</Typography>
                <Typography variant="body2">Antal Svar: {malibuData.antalSvar}</Typography>
              </Box>
            </Grid>
          )}

          {schoolDetails && (
            <Grid item xs={12} md={6} sx={{ zIndex: 3000 }}>
              <Box>
                <Typography variant="h6" sx={{ }}>Skoldetaljer</Typography>
                <Typography variant="body2">Typ av Service: {schoolDetails.typAvService}</Typography>
                <Typography variant="body2">Verksam i: {schoolDetails.verksamI}</Typography>
                <Typography variant="body2">Organisationsform: {schoolDetails.organisationsform}</Typography>
                <Typography variant="body2">Antal Barn: {schoolDetails.antalBarn}</Typography>
                <Typography variant="body2">Antal Barn per Årsarbetare: {schoolDetails.antalBarnPerArsarbetare}</Typography>
                <Typography variant="body2">Andel Legitimerade Förskollärare: {schoolDetails.andelLegitimeradeForskollarare}%</Typography>
                <Typography variant="body2">Inriktning och Profil: {schoolDetails.inriktningOchProfil}</Typography>
                <Typography variant="body2">Webbplats: <a href={schoolDetails.webbplats} target="_blank" rel="noopener noreferrer">{schoolDetails.webbplats}</a></Typography>
              </Box>
            </Grid>
          )}
            {schoolDetails && schoolDetails.kontakter && schoolDetails.kontakter.$values && schoolDetails.kontakter.$values.length > 0 && (
            <Grid item xs={12} sx={{ zIndex: 3000 }}> {/* Sätt z-index här */}
              
                <Typography variant="h6" sx={{  }}>Kontaktinformation</Typography>
                {schoolDetails.kontakter.$values.map((kontakt, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="body2"> {kontakt.namn}</Typography>
                    <Typography variant="body2">{kontakt.roll}</Typography>
                    <Typography variant="body2">{kontakt.epost}</Typography>
                    <Typography variant="body2">{kontakt.telefon}</Typography>
                  </Box>
                ))}
             
            </Grid>
          )}
        </Grid>
        {dataFetched && chartData.length > 0 && (
  <div style={{ width: '100%', maxWidth: '800px', margin: '40px auto', height: '50vh', marginBottom: '100px', color: '#333', zIndex: 3000 }}>
    <Typography variant="h6" sx={{ fontSize: '1.5rem', textAlign: 'center', zIndex: 3000 }}>Jag är som helhet nöjd med mitt barns förskola</Typography>
    <Bar
  data={{
    labels: chartData[0].data.labels, // Använd etiketter från det första årets data
    datasets: chartData.map((chart) => ({
      label: `Resultat för ${chart.year}`,
      data: chart.data.datasets[0].data, // Data för respektive år
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`, // Slumpmässig färg
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 1
    }))
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#333',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Jämförelse mellan år',
        color: '#333',
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`; // Lägg till procentsymbol i tooltip
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#333'
        }
      },
      y: {
        ticks: {
          color: '#333',
          callback: function (value) {
            return value + '%'; // Visa procentsymbol på y-axeln
          }
        },
        beginAtZero: true,
        max: 100 // Sätter maximivärdet till 100 för procent
      }
    }
  }}
/>

  </div>
)}

        

        {error && <Typography variant="body2" sx={{ color: 'red', marginTop: '50px', zIndex: 3000 }}>{error}</Typography>}
        {dataFetched && chartData.length === 0 && !loading && (
          <Typography variant="body2" sx={{ color: '#333', zIndex: 3000 }}></Typography>
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
