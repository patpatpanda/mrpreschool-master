import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { TextField, MenuItem, Button, Box, CircularProgress } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyChart = () => {
  const [forskoleverksamhet, setForskoleverksamhet] = useState('');
  const [fragetext, setFragetext] = useState('');
  const [forskoleverksamhetOptions, setForskoleverksamhetOptions] = useState([]);
  const [fragetextOptions, setFragetextOptions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataFetched, setDataFetched] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState({ forskoleverksamhet: true, fragetext: true });

  const years = [2023, 2022, 2021, 2020];

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const year = 2023; // Standardår
        const [forskoleResponse, frageResponse] = await Promise.all([
          axios.get('https://masterkinder20240523125154.azurewebsites.net/api/Survey/forskoleverksamheter', {
            params: { year }
          }),
          axios.get('https://masterkinder20240523125154.azurewebsites.net/api/Survey/fragetexter', {
            params: { year }
          })
        ]);
        setForskoleverksamhetOptions(forskoleResponse.data.$values || []);
        setFragetextOptions(frageResponse.data.$values || []);
      } catch (err) {
        setError('Kunde inte ladda data för dropdowns.');
      } finally {
        setDropdownLoading({ forskoleverksamhet: false, fragetext: false });
      }
    };

    loadOptions();
  }, []);

  const translateSvarsalternativ = (svarsalternativ) => {
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
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setDataFetched(false);
  
    try {
      const allChartData = await Promise.all(
        years.map(async (year) => {
          const response = await axios.get('https://masterkinder20240523125154.azurewebsites.net/api/Survey/svarsalternativ', {
            params: {
              year,
              forskoleverksamhet: forskoleverksamhet || '',
              fragetext: fragetext || '',
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
      setError('Något gick fel när data skulle hämtas.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setChartData([]);
    setDataFetched(false);
  };

  return (
    <div className="survey-chart-container" style={{ backgroundColor: '#333', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <Box sx={{ maxWidth: '800px', margin: '150px auto 0 auto', padding: '20px', backgroundColor: '#444', borderRadius: '8px' }}>
      
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '20px' }}>
          <TextField
            select
            label="Förskoleverksamhet"
            value={forskoleverksamhet}
            onChange={handleInputChange(setForskoleverksamhet)}
            fullWidth
            variant="outlined"
            margin="normal"
            disabled={dropdownLoading.forskoleverksamhet}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': { fontSize: '1rem', backgroundColor: '#555', color: '#fff' },
              '& .MuiInputLabel-root': { fontSize: '1rem', color: '#fff' },
              '& .MuiSelect-icon': { color: '#fff' }
            }}
          >
            {forskoleverksamhetOptions.length > 0 && forskoleverksamhetOptions.map((option, index) => (
              <MenuItem key={index} value={option} sx={{ fontSize: '1rem', color: '#fff' }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {dropdownLoading.forskoleverksamhet && <CircularProgress size={24} sx={{ color: '#fff', marginLeft: '10px' }} />}
        
          <TextField
            select
            label="Frågetext"
            value={fragetext}
            onChange={handleInputChange(setFragetext)}
            fullWidth
            variant="outlined"
            margin="normal"
            disabled={dropdownLoading.fragetext}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': { fontSize: '1rem', backgroundColor: '#555', color: '#fff' },
              '& .MuiInputLabel-root': { fontSize: '1rem', color: '#fff' },
              '& .MuiSelect-icon': { color: '#fff' }
            }}
          >
            {fragetextOptions.length > 0 && fragetextOptions.map((option, index) => (
              <MenuItem key={index} value={option} sx={{ fontSize: '1rem', color: '#fff', whiteSpace: 'normal' }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {dropdownLoading.fragetext && <CircularProgress size={24} sx={{ color: '#fff', marginLeft: '10px' }} />}
        </Box>
        
        <Button
          onClick={handleSearch}
          variant="contained"
          fullWidth
          sx={{ marginTop: '20px', fontSize: '1rem', padding: '10px 20px', backgroundColor: '#3f51b5', color: '#fff', '&:hover': { backgroundColor: '#303f9f' } }}
          disabled={loading}
        >
          {loading ? 'Laddar...' : 'Visa stapeldiagram'}
        </Button>

        {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

        {dataFetched && chartData.length > 0 && chartData.map((chart, index) => (
          <div key={index} style={{ width: '100%', maxWidth: '800px', margin: '40px auto', height: '50vh', marginBottom: '60px', color: '#fff' }}>
            <h3 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Stapeldiagram över svar - {chart.year}</h3>
            <Bar
              data={chart.data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#fff', // Gör legenden vit
                      font: {
                        size: 14 // Gör texten större
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: `Resultat för ${chart.year}`,
                    color: '#fff', // Gör titeltexten vit
                    font: {
                      size: 18 // Gör titeln större
                    }
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#fff' // Gör X-axelns text vit
                    }
                  },
                  y: {
                    ticks: {
                      color: '#fff' // Gör Y-axelns text vit
                    }
                  }
                }
              }}
            />
          </div>
        ))}

        {dataFetched && chartData.length === 0 && !loading && <p style={{ color: '#fff' }}>Ingen data att visa</p>}
      </Box>
    </div>
  );
};

export default SurveyChart;
