// import React, { useState, useEffect, useCallback } from 'react';
// import { Bar } from 'react-chartjs-2';
// import axios from 'axios';

// const SurveyChart = ({ schoolName }) => {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const years = [2023, 2022, 2021, 2020];

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const allChartData = await Promise.all(
//         years.map(async (year) => {
//           const encodedName = encodeURIComponent(schoolName);
//           const response = await axios.get(`https://masterkinder20240523125154.azurewebsites.net/api/Survey/Results/${year}/${encodedName}`);
          
//           const responseData = response.data;

//           if (!responseData || !responseData.$values || responseData.$values.length === 0) {
//             return null;
//           }

//           const nojdData = responseData.$values.find(item => item.fragetext === 'Jag är som helhet nöjd med mitt barns förskola');
//           const rekommenderaData = responseData.$values.find(item => item.fragetext === 'Jag kan rekommendera mitt barns förskola');

//           return {
//             year,
//             nojdData: nojdData ? nojdData.procentSvarAlternativ.map(item => item.procent) : [],
//             rekommenderaData: rekommenderaData ? rekommenderaData.procentSvarAlternativ.map(item => item.procent) : [],
//           };
//         })
//       );

//       setChartData(allChartData.filter(data => data !== null));
//     } catch (err) {
//       setError('Ett oväntat fel inträffade.');
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolName]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return (
//     <div style={{ width: '100%', maxWidth: '800px', margin: '40px auto', height: '50vh' }}>
//       {chartData.length > 0 && (
//         <Bar
//           data={{
//             labels: ['2020', '2021', '2022', '2023'],
//             datasets: [
//               {
//                 label: 'Jag är som helhet nöjd med mitt barns förskola',
//                 data: chartData.map(chart => chart.nojdData[0]),
//                 backgroundColor: 'rgba(46, 204, 113, 0.6)',
//                 borderColor: 'rgba(46, 204, 113, 1)',
//                 borderWidth: 1,
//               },
//               {
//                 label: 'Jag kan rekommendera mitt barns förskola',
//                 data: chartData.map(chart => chart.rekommenderaData[0]),
//                 backgroundColor: 'rgba(54, 162, 235, 0.6)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//               },
//             ],
//           }}
//           options={{
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//               y: {
//                 beginAtZero: true,
//                 max: 100,
//               },
//             },
//           }}
//         />
//       )}
//       {loading && <p>Laddar data...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default SurveyChart;
