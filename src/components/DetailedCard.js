import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Ändrad ikon
import { styled } from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';

import myImage from '../images/seri.webp';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


// Registrera diagramkomponenter för Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Styled components för styling av dialogen
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#333',
    width: '100%',
    height: '100%',
    margin: 0,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: '#a15bb8',
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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [error, setError] = useState('');

  const years = [2023, 2022, 2021, 2020];

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setDataFetched(false);

    try {
      const allChartData = await Promise.all(
        years.map(async (year) => {
          const response = await axios.get('https://masterkinder20240523125154.azurewebsites.net/api/Survey/svarsalternativ', {
            params: {
              year,
              forskoleverksamhet: namn,
              fragetext: "Jag är som helhet nöjd med mitt barns förskola",
            }
          });
          const responseData = response.data;
          const dataArray = responseData.$values || [];

          if (dataArray.length > 0) {
            const labels = dataArray.map(item => translateSvarsalternativ(item.svarsalternativText));
            const dataValues = dataArray.map(item => parseInt(item.utfall, 10) || 0);
            const totalSvar = dataValues.reduce((acc, value) => acc + value, 0);

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
        })
      );

      setChartData(allChartData.filter(data => data !== null));
      setDataFetched(true);
    } catch (err) {
      console.error("API Error:", err);
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError('Data kunde inte hittas.');
            break;
          case 500:
            setError('Serverfel. Försök igen senare.');
            break;
          default:
            setError('Ett oväntat fel inträffade.');
        }
      } else {
        setError('Nätverksfel eller API är inte tillgängligt.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [namn]);

  const translateSvarsalternativ = useMemo(() => (svarsalternativ) => {
    const mapping = {
      "1": "Instämmer inte alls",
      "2": "Instämmer i liten utsträckning",
      "3": "Instämmer till viss del",
      "4": "Instämmer i stor utsträckning",
      "5": "Instämmer helt",
      "Instämmer inte alls": "Instämmer inte alls",
      "Instämmer i liten utsträckning": "Instämmer i liten utsträckning",
      "Instämmer till viss del": "Instämmer till viss del",
      "Instämmer i stor utsträckning": "Instämmer i stor utsträckning",
      "Instämmer helt": "Instämmer helt",
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
        {/* Tillbaka-knapp i det övre vänstra hörnet */}
        <IconButton
           onClick={onClose}
          sx={{ position: 'absolute', left: 16, top: 16, color: '#fff', zIndex: 2 }}
        >
          <ChevronLeftIcon />
        </IconButton>
        {namn}
        {/* Stäng-knapp i det övre högra hörnet */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: '#fff', zIndex: 2 }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </StyledDialogTitle>
      <StyledDialogContent>
        <ImageContainer>
          <img src={imageUrl} alt={`${namn}`} />
        </ImageContainer>

        {schoolDetails.beskrivning && (
          <Box mb={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              Beskrivning
            </Typography>
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
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}>Föräldraomdömen år 2024</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>{malibuData.helhetsomdome}% är som helhet nöjd med mitt barns förskola</Typography>
                <Typography variant="body2" sx={{ marginBottom: '8px' }}>Svarsfrekvens: {malibuData.svarsfrekvens}%</Typography>
                <Typography variant="body2" sx={{ marginBottom: '16px' }}>Antal Svar: {malibuData.antalSvar}</Typography>
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
        </Grid>

        {/* Visa stapeldiagrammen om datan har hämtats */}
        {error && <Typography variant="body2" sx={{ color: 'red', marginTop: '50px' }}>{error}</Typography>}

        {dataFetched && chartData.length > 0 && chartData.map((chart, index) => (
          <div key={index} style={{ width: '100%', maxWidth: '800px', margin: '40px auto', height: '50vh', marginBottom: '100px', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', textAlign: 'center' }}>Jag är som helhet nöjd med mitt barns förskola</Typography>
            <Bar
              data={chart.data}
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
                    text: `Resultat för ${chart.year}`,
                    color: '#333',
                    font: {
                      size: 18
                    }
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#333'
                    }
                  },
                  y: {
                    ticks: {
                      color: '#333'
                    }
                  }
                }
              }}
            />
          </div>
        ))}

        {dataFetched && chartData.length === 0 && !loading && (
          <Typography variant="body2" sx={{ color: '#fff' }}>Ingen data att visa</Typography>
        )}
      </StyledDialogContent>
    </StyledDialog>
  );
};

DetailedCard.propTypes = {
  schoolData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedCard;
