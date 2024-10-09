import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, CircularProgress, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';  
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import myImage from '../images/seri.webp';
import UpdateSchool from './UpdateSchool';
import { jwtDecode } from 'jwt-decode';

// Registrera linjediagramkomponenter för Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('user');
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem('user');
    return false;
  }
};

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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    margin: 0,
    color: theme.palette.text.primary,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',

    '@media (min-width: 1200px)': {
      width: '70%',
    },
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2.5),
  height: 'calc(100% - 64px)',
  overflowY: 'auto',
  color: theme.palette.text.primary,
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textAlign: 'center',
  padding: theme.spacing(3),
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  background: theme.palette.primary.main,
}));

const DetailedCard = ({ schoolData, onClose }) => {
  const { namn, adress, walkingTime, bildUrl, schoolDetails } = schoolData;
  const [setSchoolData] = useState({});
  const [editing, setEditing] = useState(false);
  const [chartDataArray, setChartDataArray] = useState([]);
  const [remainingQuestions, setRemainingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noData, setNoData] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleUpdateSuccess = (updatedData) => {
    setSchoolData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
    setEditing(false);
  };

  const fetchDataForYear = async (year, encodedName) => {
    const url = `https://masterkinder20240523125154.azurewebsites.net/api/Survey/Results/${year}/${encodedName}`;
    const response = await axios.get(url);
    return response.data.$values;
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setNoData(false);
    try {
      const encodedName = encodeURIComponent(namn);
      const dataByYear = await Promise.all([2023, 2022, 2021, 2020].map((year) => fetchDataForYear(year, encodedName)));

      const question = {
        label: 'Jag är nöjd med mitt barns förskola som helhet',
        questionText: 'Jag är som helhet nöjd med mitt barns förskola',
        borderColor: 'rgba(46, 204, 113, 1)',
      };

      const chartData = dataByYear.map((data) => 
        data.find((item) => item.fragetext === question.questionText)?.procentSvarAlternativ?.$values.find((svar) => svar.svarsalternativ === 5)?.procent || 0
      );

      // Kontrollera om all data är 0
      const hasData = chartData.some((value) => value !== 0);

      if (!hasData) {
        setNoData(true); // Ingen relevant data
        setLoading(false);
        return;
      }

      const allDataChart = {
        labels: [2020, 2021, 2022, 2023],
        datasets: [
          {
            label: question.label,
            data: chartData,
            borderColor: question.borderColor,
            fill: false, // Linjediagram
          },
        ],
      };

      setChartDataArray([allDataChart]);

      const remainingQuestionsList = [
        {
          label: 'Jag kan varmt rekommendera mitt barns förskola',
          questionText: 'Jag kan rekommendera mitt barns förskola',
          borderColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'Jag känner mig välkommen att ge feedback',
          questionText: 'Jag känner mig välkommen att ställa frågor och framföra synpunkter på verksamheten',
          borderColor: 'rgba(255, 159, 64, 1)',
        },
        {
          label: 'Personalen bemöter mitt barn på ett respektfullt sätt',
          questionText: 'Jag upplever att personalen på förskolan bemöter mitt barn på ett respektfullt sätt',
          borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
          label: 'Jag känner att förskolan är trygg',
          questionText: 'Jag upplever att förskolan i sin helhet är trygg och säker för mitt barn',
          borderColor: 'rgba(54, 162, 235, 1)',  // Blå färg
        },
      ];

      const remainingChartData = remainingQuestionsList.map((question) => ({
        labels: [2020, 2021, 2022, 2023],
        datasets: [
          {
            label: question.label,
            data: dataByYear.map((data) =>
              data.find((item) => item.fragetext === question.questionText)?.procentSvarAlternativ?.$values.find((svar) => svar.svarsalternativ === 5)?.procent || 0
            ),
            borderColor: question.borderColor,
            fill: false, // Linjediagram
          },
        ],
      }));

      setRemainingQuestions(remainingChartData);
      setLoading(false);
    } catch (error) {
      setError('Kunde inte hämta data.');
      setLoading(false);
    }
  }, [namn]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
        <Typography variant="h5">{namn}</Typography>
      </StyledDialogTitle>

      <StyledDialogContent>
        {/* Bilden */}
        <ImageContainer>
          <img src={imageUrl} alt={`${namn}`} />
        </ImageContainer>

        {editing ? (
          <UpdateSchool
            schoolToUpdateId={schoolData.id}
            currentData={{
              namn: schoolData.namn,
              adress: schoolData.adress,
              beskrivning: schoolData.beskrivning,
              antalBarn: schoolData.antalBarn,
              typAvService: schoolData.typAvService,
            }}
            onUpdateSuccess={handleUpdateSuccess}
          />
        ) : (
          <Box mb={4}>
            <Typography variant="h6">Skolinformation</Typography>
            {schoolData.beskrivning && (
              <Typography variant="body2">{schoolData.beskrivning}</Typography>
            )}
            {isAuthenticated() && (
              <Button variant="outlined" onClick={handleEditClick} sx={{ marginTop: 2 }}>
                Redigera Skolinformation
              </Button>
            )}
          </Box>
        )}

        {/* Visa gångtid */}
        {walkingTime && (
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', color: '#4CAF50' }} />
            Beräknad gångtid: {walkingTime} minuter
          </Typography>
        )}

        {/* Visa adress */}
        {adress && (
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#4CAF50' }} />
            {adress}
          </Typography>
        )}

        {/* Visa schoolDetails om de finns */}
        {schoolDetails && (
          <Box mt={4}>
            <Typography variant="h6">Detaljer om skolan</Typography>
            {schoolDetails.typAvService && (
              <Typography variant="body2">Typ av Service: {schoolDetails.typAvService}</Typography>
            )}
            {schoolDetails.verksamI && (
              <Typography variant="body2">Verksam i: {schoolDetails.verksamI}</Typography>
            )}
            {schoolDetails.organisationsform && (
              <Typography variant="body2">Organisationsform: {schoolDetails.organisationsform}</Typography>
            )}
            {schoolDetails.antalBarn && (
              <Typography variant="body2">Antal Barn: {schoolDetails.antalBarn}</Typography>
            )}
            {schoolDetails.antalBarnPerArsarbetare && (
              <Typography variant="body2">Antal Barn per Årsarbetare: {schoolDetails.antalBarnPerArsarbetare}</Typography>
            )}
            {schoolDetails.andelLegitimeradeForskollarare && (
              <Typography variant="body2">Andel Legitimerade Förskollärare: {schoolDetails.andelLegitimeradeForskollarare}%</Typography>
            )}
            {schoolDetails.inriktningOchProfil && (
              <Typography variant="body2">Inriktning och Profil: {schoolDetails.inriktningOchProfil}</Typography>
            )}
            {schoolDetails.kostOchMaltider && (
              <Typography variant="body2">Kost och Måltider: {schoolDetails.kostOchMaltider}</Typography>
            )}
            {schoolDetails.inneOchUtemiljo && (
              <Typography variant="body2">Inne- och Utemiljö: {schoolDetails.inneOchUtemiljo}</Typography>
            )}
            {schoolDetails.malOchVision && (
              <Typography variant="body2">Mål och Vision: {schoolDetails.malOchVision}</Typography>
            )}
            {schoolDetails.webbplats && (
              <Typography variant="body2">
                Webbplats: <a href={schoolDetails.webbplats} target="_blank" rel="noopener noreferrer">{schoolDetails.webbplats}</a>
              </Typography>
            )}
          </Box>
        )}

        {/* Diagram och laddningsindikator */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
            <CircularProgress />
            <Typography sx={{ marginTop: '10px', color: '#555' }}>Hämtar statistik...</Typography>
          </Box>
        ) : error ? (
          <Typography variant="body2" sx={{ color: 'red' }}>{error}</Typography>
        ) : noData ? (
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#555', marginTop: '20px' }}>
            Ingen statistik tillgänglig
          </Typography>
        ) : (
          <>
            {chartDataArray.map((chartData, index) => (
              <Box key={index} sx={{ width: '100%', maxWidth: '800px', margin: '40px auto' }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true },
                      title: {
                        display: true,
                        text: chartData.datasets[0].label,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function (value) {
                            return value + '%';
                          },
                        },
                      },
                    },
                  }}
                  height={400}
                />
              </Box>
            ))}

            {/* Ytterligare diagram om fler svar visas */}
            {remainingQuestions.map((chartData, index) => (
              <Box key={index} sx={{ width: '100%', maxWidth: '800px', margin: '40px auto' }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true },
                      title: {
                        display: true,
                        text: chartData.datasets[0].label,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function (value) {
                            return value + '%';
                          },
                        },
                      },
                    },
                  }}
                  height={400}
                />
              </Box>
            ))}
          </>
        )}
          <Box sx={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#555' }}>
    <Typography variant="body2">Statistik hämtad från https://forskola.stockholm/</Typography>
  </Box>
      </StyledDialogContent>
    </StyledDialog>
  );
};

DetailedCard.propTypes = {
  schoolData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    typAvService: PropTypes.string,
    antalBarn: PropTypes.number,
    namn: PropTypes.string.isRequired,
    adress: PropTypes.string,
    beskrivning: PropTypes.string,
    bildUrl: PropTypes.string,
    walkingTime: PropTypes.string,
    schoolDetails: PropTypes.shape({
      beskrivning: PropTypes.string,
      typAvService: PropTypes.string,
      verksamI: PropTypes.string,
      organisationsform: PropTypes.string,
      antalBarn: PropTypes.number,
      antalBarnPerArsarbetare: PropTypes.number,
      andelLegitimeradeForskollarare: PropTypes.number,
      inriktningOchProfil: PropTypes.string,
      kostOchMaltider: PropTypes.string,
      inneOchUtemiljo: PropTypes.string,
      malOchVision: PropTypes.string,
      webbplats: PropTypes.string,
      kontakter: PropTypes.shape({
        $values: PropTypes.arrayOf(PropTypes.shape({
          namn: PropTypes.string,
          roll: PropTypes.string,
          epost: PropTypes.string,
          telefon: PropTypes.string
        })),
      }),
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedCard;
