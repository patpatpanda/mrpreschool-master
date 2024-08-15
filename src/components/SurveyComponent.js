import React, { useState } from 'react';
import axios from 'axios';

const SurveyComponent = () => {
  const [year, setYear] = useState('');
  const [forskoleverksamhet, setForskoleverksamhet] = useState('');
  const [fragetext, setFragetext] = useState('');
  const [frageNr, setFrageNr] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (endpoint) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://masterkinder20240523125154.azurewebsites.net/api/Survey/${endpoint}`, {
        params: {
          year,
          forskoleverksamhet,
          fragetext: fragetext || undefined,
          frageNr: frageNr || undefined
        }
      });
      setData(response.data);
    } catch (err) {
      setError('Något gick fel när data skulle hämtas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Hämta Survey Responses</h2>
      <div>
        <label>
          År:
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Ange år..."
          />
        </label>
      </div>
      <div>
        <label>
          Förskoleverksamhet:
          <input
            type="text"
            value={forskoleverksamhet}
            onChange={(e) => setForskoleverksamhet(e.target.value)}
            placeholder="Ange förskoleverksamhet..."
          />
        </label>
      </div>
      <div>
        <label>
          Frågetext:
          <input
            type="text"
            value={fragetext}
            onChange={(e) => setFragetext(e.target.value)}
            placeholder="Ange frågetext (valfritt)..."
          />
        </label>
      </div>
      <div>
        <label>
          FrageNr:
          <input
            type="text"
            value={frageNr}
            onChange={(e) => setFrageNr(e.target.value)}
            placeholder="Ange FrageNr (valfritt)..."
          />
        </label>
      </div>
      <button onClick={() => handleSearch('')} disabled={loading}>
        {loading ? 'Laddar...' : 'Hämta alla data'}
      </button>
      <button onClick={() => handleSearch('nojd')} disabled={loading}>
        {loading ? 'Laddar...' : 'Hämta nöjda data'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div>
          <h3>Resultat</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SurveyComponent;
