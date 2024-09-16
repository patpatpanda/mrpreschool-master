import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { styled, keyframes, useTheme } from '@mui/material/styles'; // Inkludera useTheme för att få tillgång till temat
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

// Stil för titeln med en lättare animering och temafärger
const AnimatedTitle = styled(Typography)(({ theme }) => ({
  animation: `${slideIn} 0.7s ease-in-out`,
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,  // Använd primärfärgen från temat
  textAlign: 'center',
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
  },
}));

// Stil för bildcontainern med en snyggare övergångseffekt och lite skuggning
const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '15px',
  boxShadow: theme.shadows[4], // Använd skugga från temat

  '& img': {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    transition: 'transform 0.4s ease-in-out', // Smidig zoom-effekt
  },

  '&:hover img': {
    transform: 'scale(1.05)', // Zooma in bilden vid hover
  },

  maxHeight: '500px', // Höjd för större skärmar
  [theme.breakpoints.up('sm')]: {
    maxHeight: '400px',
  },
  [theme.breakpoints.up('md')]: {
    maxHeight: '500px',
  },
}));

// Dialogstil med förbättrad layout och färgsättning från temat
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '25px',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper, // Använd bakgrundsfärg från temat
    width: '100%',
    height: '100%',
    margin: 0,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[10],

    [theme.breakpoints.up('sm')]: {
      width: '75%', // Lite bredare layout för större skärmar
    },
  },
}));

// Stil för dialogens rubrik med en gradient och tematiserad layout
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.common.white,
  textAlign: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`, // Gradient baserad på temafärger
}));

// Stil för dialogens innehåll med bättre padding och temafärger
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,  // Använd bakgrund från temat
  padding: theme.spacing(3),
  height: 'calc(100% - 64px)',
  overflowY: 'auto',
}));


const DetailedCard = ({ schoolData, onClose }) => {
  const theme = useTheme();
  if (!schoolData) {
    // Om ingen data har skickats, visa en fallback.
    return <div>Ingen data tillgänglig för denna förskola.</div>;
  }
  const { namn, adress,  schoolDetails, walkingTime } = schoolData;
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
            console.log('API Response:', response.data);
            
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
  
    // Lägg till denna rad för att se den hämtade datan i konsolen
    console.log('Chart Data:', chartData);
  }, [fetchData]);
  
  const translateSvarsalternativ = useMemo(() => (svarsalternativ) => {
    const mapping = {
      "1": "2020",
      "2": "2021",
      "3": "2022",
      "4": "2023"
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
            right: 8,
            top: 8,
            color: '#fff',
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        {/* Kreativ titel med animering */}
        <AnimatedTitle>{namn}</AnimatedTitle>

        {/* Bild med subtil zoom-effekt */}
        <ImageContainer>
          <img src={imageUrl} alt={`${namn}`} />
        </ImageContainer>

        {/* Visa skolbeskrivning och detaljer med bättre struktur */}
        {schoolDetails.beskrivning && (
          <Box mb={4}>
            <Typography variant="h6" sx={{ color: '#333', marginBottom: '8px', fontWeight: 'bold' }}>
              Om förskolan
            </Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>
              {schoolDetails.beskrivning}
            </Typography>
          </Box>
        )}

        {walkingTime && (
          <Typography variant="body2" sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', color: '#555' }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', color: '#4CAF50' }} /> Gångtid: {walkingTime} minuter
          </Typography>
        )}

        {adress && (
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
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
    labels: ['2020', '2021', '2022', '2023'], // År som etiketter
    datasets: [{
      label: 'Andel som instämmer helt (%)',
      data: chartData.map((chart) => {
        // Hitta datan för "Instämmer helt" eller svarsalternativet 5
        const index = chart.data.labels.findIndex(label => label === 'Instämmer helt' || label === 5);
        if (index !== -1) {
          return chart.data.datasets[0].data[index]; // Hämta procentsatsen för 'Instämmer helt' eller 5
        } else {
          return 0; // Om det inte finns data för 'Instämmer helt' eller siffran 5
        }
      }),
      backgroundColor: 'rgba(46, 204, 113, 0.6)', // Sätter samma färg för alla staplar (Grön)
      borderColor: 'rgba(46, 204, 113, 1)', // Gränsfärg för staplarna
      borderWidth: 1
    }]
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
