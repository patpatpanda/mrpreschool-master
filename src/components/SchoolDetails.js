// import React from 'react';
// import { Typography, Box, Grid } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

// const SchoolDetails = ({ schoolData }) => {
//   const { namn, adress, schoolDetails, walkingTime } = schoolData;

//   return (
//     <Box>
//       <Typography variant="h6">{namn}</Typography>

//       <Grid container spacing={2}>
//         {schoolDetails && (
//           <Grid item xs={12} md={6}>
//             <Box>
//               <Typography variant="h6" sx={{ marginBottom: 2 }}>Skoldetaljer</Typography>
//               <Typography variant="body2" sx={{ marginBottom: 1 }}>Typ av Service: {schoolDetails.typAvService}</Typography>
//               <Typography variant="body2" sx={{ marginBottom: 1 }}>Verksam i: {schoolDetails.verksamI}</Typography>
//               <Typography variant="body2" sx={{ marginBottom: 1 }}>Organisationsform: {schoolDetails.organisationsform}</Typography>
//               <Typography variant="body2" sx={{ marginBottom: 1 }}>Antal Barn: {schoolDetails.antalBarn}</Typography>
//               <Typography variant="body2" sx={{ marginBottom: 1 }}>Andel Legitimerade Förskollärare: {schoolDetails.andelLegitimeradeForskollarare}%</Typography>
//             </Box>
//           </Grid>
//         )}
//         {adress && (
//           <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//             <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} /> {adress}
//           </Typography>
//         )}
//         {walkingTime && (
//           <Typography variant="body2" sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
//             <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} /> Beräknad gångtid: {walkingTime} minuter
//           </Typography>
//         )}
//       </Grid>
//     </Box>
//   );
// };

// export default SchoolDetails;
