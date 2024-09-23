// SurveyChart.js
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrera diagramkomponenter för Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyChart = ({ schoolName }) => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const years = [2023, 2022, 2021, 2020];

  const chartOptions = {
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
  };

  const fetchData = useCallback(async () => {
    try {
      const dataByYear = await Promise.all(
        years.map(async (year) => {
          const encodedName = encodeURIComponent(schoolName);
          const response = await axios.get(
            `https://masterkinder20240523125154.azurewebsites.net/api/Survey/Results/${year}/${encodedName}`
          );
          return response.data.$values;
        })
      );

      const nojdData = years.map((year, index) => {
        const dataForYear = dataByYear[index].find(item => item.fragetext === 'Jag är som helhet nöjd med mitt barns förskola');
        if (dataForYear) {
          const procentSvar = dataForYear.procentSvarAlternativ?.$values || [];
          const positivtSvar = procentSvar.find(svar => svar.svarsalternativ === 5);
          return positivtSvar ? positivtSvar.procent : 0;
        }
        return 0;
      });

      const rekommenderaData = years.map((year, index) => {
        const dataForYear = dataByYear[index].find(item => item.fragetext === 'Jag kan rekommendera mitt barns förskola');
        if (dataForYear) {
          const procentSvar = dataForYear.procentSvarAlternativ?.$values || [];
          const positivtSvar = procentSvar.find(svar => svar.svarsalternativ === 5);
          return positivtSvar ? positivtSvar.procent : 0;
        }
        return 0;
      });

      const personalData = years.map((year, index) => {
        const dataForYear = dataByYear[index].find(item => item.fragetext === 'Jag upplever att personalen på förskolan bemöter mig på ett respektfullt sätt');
        if (dataForYear) {
          const procentSvar = dataForYear.procentSvarAlternativ?.$values || [];
          const positivtSvar = procentSvar.find(svar => svar.svarsalternativ === 5);
          return positivtSvar ? positivtSvar.procent : 0;
        }
        return 0;
      });

      setChartData({
        labels: years,
        datasets: [
          {
            label: 'Jag är nöjd med mitt barns förskola som helhet',
            data: nojdData,
            backgroundColor: 'rgba(46, 204, 113, 0.6)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1,
          },
          {
            label: 'Jag kan varmt rekommendera mitt barns förskola',
            data: rekommenderaData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Personalen bemöter mig alltid på ett respektfullt sätt',
            data: personalData,
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Kunde inte hämta data.');
    }
  }, [schoolName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: '40px auto' }}>
      {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
        <>
          <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Jag är nöjd med mitt barns förskola som helhet
          </Typography>
          <Bar data={{ labels: years, datasets: [chartData.datasets[0]] }} options={chartOptions} height={400} />

          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
            Jag kan varmt rekommendera mitt barns förskola
          </Typography>
          <Bar data={{ labels: years, datasets: [chartData.datasets[1]] }} options={chartOptions} height={400} />

          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
            Personalen bemöter mig alltid på ett respektfullt sätt
          </Typography>
          <Bar data={{ labels: years, datasets: [chartData.datasets[2]] }} options={chartOptions} height={400} />
        </>
      ) : (
        <Typography variant="body2">{error || 'Laddar enkätsvar...'}</Typography>
      )}
    </Box>
  );
};

SurveyChart.propTypes = {
  schoolName: PropTypes.string.isRequired,
};

export default SurveyChart;
