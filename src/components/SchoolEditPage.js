import React, { useState, useEffect } from 'react';
import { fetchSchoolDetailsByAddress, fetchSurveyResponsesByName, fetchMalibuByName } from './yourApiService'; // Importera dina API-funktioner
import UpdateSchool from './UpdateSchool';

const SchoolEditPage = ({ schoolId, schoolAddress, schoolName }) => {
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState(null);
  const [malibuData, setMalibuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Hämta skoldetaljer med adress
        const details = await fetchSchoolDetailsByAddress(schoolAddress);

        // Hämta undersökningssvar med skolans namn
        const surveyData = await fetchSurveyResponsesByName(schoolName);

        // Hämta Malibu-data (pdf) för skolan
        const malibu = await fetchMalibuByName(schoolName);

        // Kombinera data till ett state-objekt
        setSchoolDetails(details);
        setSurveyResponses(surveyData);
        setMalibuData(malibu);
      } catch (err) {
        setError('Kunde inte hämta data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolAddress, schoolName]);

  // Hantering av uppdatering
  const handleUpdateSuccess = (updatedDetails) => {
    console.log('Uppdatering lyckades med data:', updatedDetails);
    setSchoolDetails(updatedDetails); // Uppdatera med nya detaljer
  };

  if (loading) {
    return <div>Laddar...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Redigera skola</h1>
      {/* Skicka endast skoldetaljer till UpdateSchool för att uppdateras */}
      {schoolDetails && (
        <UpdateSchool
          schoolToUpdateId={schoolId}
          currentDetails={schoolDetails}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default SchoolEditPage;
