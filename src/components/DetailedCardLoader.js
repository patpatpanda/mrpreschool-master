import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailedCard from './DetailedCard';
import { fetchSchoolById } from './api'; // Antag att detta API-anrop hämtar skolans data

const DetailedCardLoader = () => {
  const { id } = useParams(); // Hämta förskolans ID från URL:en
  const navigate = useNavigate(); // Navigera användaren om det behövs
  const [school, setSchool] = useState(null); // För att lagra förskoledata
  const [loading, setLoading] = useState(true); // För att visa laddningsindikator
  const [error, setError] = useState(null); // För att hantera fel

  // Hämta förskolan när komponenten laddas eller när ID ändras
  useEffect(() => {
    if (id) {
      fetchSchoolById(id)
        .then((data) => {
          if (data) {
            setSchool(data);
            setLoading(false);
          } else {
            setError('Förskolan hittades inte.');
            setLoading(false);
            navigate('/'); // Om förskolan inte hittas, navigera tillbaka till startsidan
          }
        })
        .catch((error) => {
          setError('Ett fel uppstod när data hämtades.');
          setLoading(false);
        });
    }
  }, [id, navigate]);

  // Om det laddas, visa en indikator
  if (loading) {
    return <div>Hämtar förskoleinformation...</div>;
  }

  // Om ett fel inträffar, visa ett felmeddelande
  if (error) {
    return <div>{error}</div>;
  }

  // Om förskolan har hämtats, visa DetailedCard
  return (
    <div>
      {school && <DetailedCard schoolData={school} onClose={() => navigate('/')} />}
    </div>
  );
};

export default DetailedCardLoader;
