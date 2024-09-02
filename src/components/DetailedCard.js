import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material'; // Importera ChevronLeftIcon
import { styled } from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import myImage from '../images/seri.webp';

// Registrera diagramkomponenter för Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    width: '100%',
    height: '100%',
    margin: 0,
    zIndex: 3000, // Sätt z-index här
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5b3fd 0%, #8e5597 100%)',
  color: '#ffffff',
  textAlign: 'center',
  padding: '16px',
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 'bold',
  position: 'relative',
  display: 'flex', // Använd flexbox för att organisera barnkomponenterna
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000, // Sätt z-index här
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: '20px',
  height: 'calc(100% - 64px)',
  overflowY: 'auto',
  zIndex: 3000, // Sätt z-index här
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
  zIndex: 3000, // Sätt z-index här

  img: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    maxHeight: '400px',
    [theme.breakpoints.up('md')]: {
      maxHeight: '500px',
      maxWidth: '80%',
    },
    [theme.breakpoints.up('lg')]: {
      maxHeight: '600px',
      maxWidth: '70%',
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
    zIndex: 3000, // Sätt z-index här
    transition: 'opacity 0.5s ease',
    opacity: 0,
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
  zIndex: 3000, // Sätt z-index här
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
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
        {/* Tillbaka ikon */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            left: { xs: 8, sm: 16 },  // 8px för mobil, 16px för större skärmar
            top: { xs: 8, sm: 16 },    // 8px för mobil, 16px för större skärmar
            color: '#333',
            zIndex: 3000, // Sätt z-index här
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Rubrik som tidigare */}
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            lineHeight: 'normal',
            display: 'block',
            mx: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#fff',  // Vit textfärg för rubriken
            zIndex: 3000, // Sätt z-index här
          }}
        >
          {namn}
        </Typography>

        {/* Stäng-knapp i det övre högra hörnet */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: { xs: 8, sm: 16 },  // 8px för mobil, 16px för större skärmar
            top: { xs: 8, sm: 16 },    // 8px för mobil, 16px för större skärmar
            color: '#fff',
            zIndex: 3000, // Sätt z-index här
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        <ImageContainer>
          <img src={imageUrl} alt={`${namn}`} />
        </ImageContainer>

        {schoolDetails.beskrivning && (
          <Box mb={4} sx={{ zIndex: 3000 }}> {/* Sätt z-index här */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              Beskrivning
            </Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>
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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#333', zIndex: 3000 }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#4CAF50' }} /> {adress}
          </Typography>
        )}

        <Grid container spacing={2}>
          {malibuData && (
            <Grid item xs={12} md={6} sx={{ zIndex: 3000 }}> {/* Sätt z-index här */}
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
            <Grid item xs={12} md={6} sx={{ zIndex: 3000 }}> {/* Sätt z-index här */}
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
            <Grid item xs={12} sx={{ zIndex: 3000 }}> {/* Sätt z-index här */}
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

        {/* Visa stapeldiagrammen om datan har hämtats */}
        {error && <Typography variant="body2" sx={{ color: 'red', marginTop: '50px', zIndex: 3000 }}>{error}</Typography>}

        {dataFetched && chartData.length > 0 && chartData.map((chart, index) => (
          <div key={index} style={{ width: '100%', maxWidth: '800px', margin: '40px auto', height: '50vh', marginBottom: '100px', color: '#fff', zIndex: 3000 }}>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', textAlign: 'center', zIndex: 3000 }}>Jag är som helhet nöjd med mitt barns förskola</Typography>
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
          <Typography variant="body2" sx={{ color: '#fff', zIndex: 3000 }}>Ingen data att visa</Typography>
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
