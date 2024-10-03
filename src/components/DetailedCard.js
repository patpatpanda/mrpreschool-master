import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Button, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { styled} from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import myImage from '../images/seri.webp';
import UpdateSchool from './UpdateSchool';
import { jwtDecode } from 'jwt-decode';

// Registrera diagramkomponenter för Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


// Funktion för autentisering
const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.token) {
    return false; // Ingen användare eller token hittad
  }

  try {
    const decodedToken = jwtDecode(user.token);
    const currentTime = Date.now() / 1000; // Tid i sekunder
    if (decodedToken.exp < currentTime) {
      // Token har gått ut
      localStorage.removeItem('user'); // Rensa utgången token
      return false;
    }
    return true;
  } catch (error) {
    // Om token är felaktig eller något går fel med dekodning, logga ut användaren
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



// Stil för dialogfönstret
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    margin: 0,
    color: theme.palette.text.primary,  // Dynamiskt baserad på tema
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
  color: theme.palette.text.primary,  // Dynamiskt baserad på tema
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
  const { id, namn, adress, schoolDetails, walkingTime, bildUrl } = schoolData; // Korrigerade variabelnamn
  const [ setSchoolData] = useState({});  // Ändra namn för state
  
  const [editing, setEditing] = useState(false); // Toggle for edit mode
  const [chartDataArray, setChartDataArray] = useState([]);
  const [remainingQuestions, setRemainingQuestions] = useState([]); // För resterande frågor
  const [showMore, setShowMore] = useState(false); // För att styra om knappen "Fler svar" visas
  const [loadingFirstChart, setLoadingFirstChart] = useState(true); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [noData, setNoData] = useState(false); 

  const handleEditClick = () => {
    console.log('Editing school with ID:', id);
    setEditing(true);
  };

  const handleUpdateSuccess = (updatedData) => {
   
    setSchoolData(prevData => ({
      ...prevData,
      ...updatedData  
    }));
    setEditing(false); 
  
   
  };
  
  

  const fetchDataForYear = async (year, encodedName) => {
    const url = `https://masterkinder20240523125154.azurewebsites.net/api/Survey/Results/${year}/${encodedName}`;
    const response = await axios.get(url);
    return response.data.$values;
  };

  const fetchInitialQuestion = useCallback(async () => {
    setLoadingFirstChart(true);
    setNoData(false);
    try {
      const encodedName = encodeURIComponent(namn);
      const dataFor2023 = await fetchDataForYear(2023, encodedName);
      const dataFor2022 = await fetchDataForYear(2022, encodedName);
      const dataFor2021 = await fetchDataForYear(2021, encodedName);
      const dataFor2020 = await fetchDataForYear(2020, encodedName);
      if (!dataFor2023 || dataFor2023.length === 0) {
        setNoData(true);
        setLoadingFirstChart(false);
        return;
      }

      const question = {
        label: 'Jag är nöjd med mitt barns förskola som helhet',
        questionText: 'Jag är som helhet nöjd med mitt barns förskola',
        backgroundColor: 'rgba(46, 204, 113, 0.6)',
        borderColor: 'rgba(46, 204, 113, 1)',
      };

      const chartData = {
        labels: ['2023'],
        datasets: [
          {
            label: '',
            data: [dataFor2023.find((item) => item.fragetext === question.questionText)?.procentSvarAlternativ?.$values.find((svar) => svar.svarsalternativ === 5)?.procent || 0],
            backgroundColor: question.backgroundColor,
            borderColor: question.borderColor,
            borderWidth: 1,
          },
        ],
      };

      setChartDataArray([chartData]);

      const allDataChart = {
        labels: [2023, 2022, 2021,2020],
        datasets: [
          {
            label: question.label,
            data: [
              dataFor2023.find((item) => item.fragetext === question.questionText)?.procentSvarAlternativ?.$values.find((svar) => svar.svarsalternativ === 5)?.procent || 0,
              dataFor2022.find((item) => item.fragetext === question.questionText)?.procentSvarAlternativ?.$values.find((svar) => svar.svarsalternativ === 5)?.procent || 0,
              dataFor2021.find((item) => item.fragetext === question.questionText)?.procentSvarAlternativ?.$values.find((svar) => svar.svarsalternativ === 5)?.procent || 0,
              dataFor2020.find((item) => item.fragetext === question.questionText)?.procentSvarAlternativ?.$values.find((svar) => svar.svarsalternativ === 5)?.procent || 0,
            ],
            backgroundColor: question.backgroundColor,
            borderColor: question.borderColor,
            borderWidth: 1,
          },
        ],
      };

      setChartDataArray([allDataChart]);
      setLoadingFirstChart(false);
    } catch (error) {
      setError('Kunde inte hämta data.');
      console.error(error);
      setLoadingFirstChart(false);
    }
  }, [namn]);

  const fetchRemainingQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const encodedName = encodeURIComponent(namn);
      const dataByYear = await Promise.all([2023, 2022, 2021,2020].map(async (year) => fetchDataForYear(year, encodedName)));

      const remainingQuestions = [
        {
          label: 'Jag kan varmt rekommendera mitt barns förskola',
          questionText: 'Jag kan rekommendera mitt barns förskola',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'Jag känner mig välkommen att ge feedback',
          questionText: 'Jag känner mig välkommen att ställa frågor och framföra synpunkter på verksamheten',
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
        },
        {
          label: 'Personalen bemöter mitt barn på ett respektfullt sätt',
          questionText: 'Jag upplever att personalen på förskolan bemöter mitt barn på ett respektfullt sätt',
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
          label: 'Jag känner att förskolan är trygg',
          questionText: 'Jag upplever att förskolan i sin helhet är trygg och säker för mitt barn',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',  // En blå färg med samma transparensnivå

          borderColor: 'rgba(255, 99, 132, 1)',
        },
      ];

      const chartDataArray = remainingQuestions.map((question) => {
        const data = [2023, 2022, 2021,2020].map((year, index) => {
          const dataForYear = dataByYear[index].find(
            (item) => item.fragetext === question.questionText
          );
          if (dataForYear) {
            const procentSvar = dataForYear.procentSvarAlternativ?.$values || [];
            const positivtSvar = procentSvar.find((svar) => svar.svarsalternativ === 5);
            return positivtSvar ? positivtSvar.procent : 0;
          }
          return 0;
        });
        return {
          labels: [2023, 2022, 2021,2020],
          datasets: [
            {
              label: question.label,
              data: data,
              backgroundColor: question.backgroundColor,
              borderColor: question.borderColor,
              borderWidth: 1,
            },
          ],
        };
      });

      setRemainingQuestions(chartDataArray);
      setShowMore(true);
    } catch (error) {
      setError('Kunde inte hämta resterande data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [namn]);

  useEffect(() => {
    fetchInitialQuestion();
  }, [fetchInitialQuestion]);

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
 schoolToUpdateId={schoolData.id}  // Skicka ID för att identifiera skolan
 currentData={{
   namn: schoolData.namn,
   adress: schoolData.adress,
   beskrivning: schoolData.beskrivning,
   antalBarn: schoolData.antalBarn,
   typAvService: schoolData.typAvService,
   // Lägg till fler fält här om det behövs
 }}
 onUpdateSuccess={handleUpdateSuccess}  // Hantera uppdateringen
/>

) : (
  <Box mb={4}>
    <Typography variant="h6">Skolinformation</Typography>
 {schoolData.beskrivning && (
    <Typography variant="body2"> {schoolData.beskrivning}</Typography>
    
  )}
    {/* Visa inte dessa fält, men de kan redigeras */}
    {/* Om du inte vill visa dem, ta bort följande kod */}
    {/* <Typography variant="body2">Namn: {schoolData?.namn}</Typography> */}
    {/* <Typography variant="body2">Adress: {schoolData?.adress}</Typography> */}
    {/* <Typography variant="body2">Beskrivning: {schoolData?.beskrivning}</Typography> */}
    
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

        {/* Skoldetaljer och kontaktinformation */}
        <Grid container spacing={2}>
          {schoolDetails && (
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12}>
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

        {/* Diagram och laddningsindikatorer */}
        {loadingFirstChart ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
            <CircularProgress />
            <Typography sx={{ marginTop: '10px', color: '#555' }}>Hämtar statistik...</Typography>
          </Box>
        ) : noData ? (
          <Typography variant="body2" sx={{ color: '#555', textAlign: 'center', marginTop: '20px' }}>
            Ingen data tillgänglig från undersökningen för denna förskola.
          </Typography>
        ) : (
          chartDataArray.length > 0 &&
          chartDataArray.map((chartData, index) => (
            <Box key={index} sx={{ width: '100%', maxWidth: '800px', margin: '40px auto' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false, // Döljer legenden helt
                    },
                    title: {
                      display: true,
                      text: chartData.datasets[0].label, // Endast visa här
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function (value) {
                          return value + '%'; // Visar värden som procent
                        },
                      },
                    },
                  },
                }}
                height={400}
              />
            </Box>
          ))
        )}

        {/* Fler svar-knapp */}
        {!loadingFirstChart && !noData && !showMore && (
          <Button variant="contained" color="primary" onClick={fetchRemainingQuestions} disabled={loading}>
            {loading ? 'Laddar...' : 'Fler svar'}
          </Button>
        )}

        {/* Ytterligare diagram om fler svar visas */}
        {showMore && remainingQuestions.length > 0 &&
          remainingQuestions.map((chartData, index) => (
            <Box key={index} sx={{ width: '100%', maxWidth: '800px', margin: '40px auto' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
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
          ))
        }

        {error && <Typography variant="body2" sx={{ color: 'red' }}>{error}</Typography>}
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
    bildUrl: PropTypes.string, // Validera bildUrl
    walkingTime: PropTypes.string, // Validera walkingTime
    schoolDetails: PropTypes.shape({
      beskrivning: PropTypes.string,
      typAvService: PropTypes.string, // Validera typAvService
      verksamI: PropTypes.string, // Validera verksamI
      organisationsform: PropTypes.string, // Validera organisationsform
      antalBarn: PropTypes.number, // Validera antalBarn
      antalBarnPerArsarbetare: PropTypes.number, // Validera antalBarnPerArsarbetare
      andelLegitimeradeForskollarare: PropTypes.number, // Validera andelLegitimeradeForskollarare
      inriktningOchProfil: PropTypes.string, // Validera inriktningOchProfil
      kostOchMaltider: PropTypes.string, // Validera kostOchMaltider
      inneOchUtemiljo: PropTypes.string, // Validera inneOchUtemiljo
      malOchVision: PropTypes.string, // Validera malOchVision
      webbplats: PropTypes.string, // Validera webbplats
      kontakter: PropTypes.shape({
        $values: PropTypes.arrayOf(PropTypes.shape({
          namn: PropTypes.string,
          roll: PropTypes.string,
          epost: PropTypes.string,
          telefon: PropTypes.string
        })),
      }), // Validera kontakter och dess $values
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};


export default DetailedCard;
