import React, { useEffect, useRef, useState, useCallback } from 'react';
import PreschoolCard from './PreschoolCard';
import DetailedCard from './DetailedCard';
import OrganisationFilter from './OrganisationFilter';
import '../styles/GoogleMap.css';
import { TextField, Button, Container, Box, CircularProgress, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchSchoolById, fetchNearbySchools, fetchPdfDataByName, fetchMalibuByName, fetchSchoolDetailsByAddress } from './api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SplashScreen from './SplashScreen';
import { ButtonGroup} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';

/*global google*/

const STOCKHOLM_BOUNDS = {
  north: 59.435,
  south: 59.261,
  west: 17.757,
  east: 18.228,
};

const SERGELSTORG_COORDINATES = {
  latitude: 59.33258,
  longitude: 18.0649,
};

const geocodeAddress = async (address) => {
  console.log('Geocoding address:', address);
  try {
    const fullAddress = `${address}, Stockholm, Sweden`;
    const response = await axios.get(`https://masterkinder20240523125154.azurewebsites.net/api/Forskolan/geocode/${encodeURIComponent(fullAddress)}`);
    const data = response.data;

    if (data && data.latitude && data.longitude) {
      return { latitude: data.latitude, longitude: data.longitude };
    } else {
      console.error('Geocoding was not successful. Data:', data);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const addressRef = useRef(null);
  const [map, setMap] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaces, setShowPlaces] = useState(false);
  const [currentMarkers, setCurrentMarkers] = useState([]);
  const [originMarker, setOriginMarker] = useState(null);
  const [originPosition, setOriginPosition] = useState(null);
  const [filter, setFilter] = useState(['Kommunal', 'Fristående', 'Fristående (föräldrakooperativ)']);
  const [view, setView] = useState('list');
  const [walkingTimes, setWalkingTimes] = useState({});
  const [showText, setShowText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchMade, setSearchMade] = useState(false);
  const [filterVisible, setFilterVisible] = useState(true);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const organisationTypes = ['Kommunal', 'Fristående', 'Fristående (föräldrakooperativ)'];

  useEffect(() => {
    const initMap = () => {
      const stockholm = new google.maps.LatLng(59.3293, 18.0686);

      const map = new google.maps.Map(mapRef.current, {
        center: stockholm,
        zoom: 12,
        disableDefaultUI: true,
      });
      setMap(map);

      // Initialize DirectionsService and DirectionsRenderer
      directionsService.current = new google.maps.DirectionsService();
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // Behåll om du vill dölja markörer, annars ta bort denna rad
      });
      directionsRenderer.current.setMap(map);

      if (addressRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(addressRef.current, {
          bounds: {
            north: STOCKHOLM_BOUNDS.north,
            south: STOCKHOLM_BOUNDS.south,
            east: STOCKHOLM_BOUNDS.east,
            west: STOCKHOLM_BOUNDS.west,
          },
          componentRestrictions: { country: 'se' },
          fields: ['geometry'],
          strictBounds: false,
          types: ['address'],
        });

        autocomplete.addListener('place_changed', () => {});
      }
    };

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbJmqNnZHTZ99pPQ2uHfkDXwpMxOpfYLw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadScript();
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (id && map) {
      fetchSchoolById(id).then((school) => {
        if (school) {
          const location = new google.maps.LatLng(school.latitude, school.longitude);
          selectPlace(school);
          map.setCenter(location);
          map.setZoom(18);

          const marker = new google.maps.Marker({
            map: map,
            position: location,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(1, 1),
            },
          });

          setOriginMarker(marker);
          createMarker(school, location);
          setShowPlaces(true);
          setShowText(false);
          setView('map');
        }
      });
    }
  }, [id, map]);

  const findNearbyPlaces = useCallback(async (location) => {
    try {
      setLoading(true);
      console.log('Fetching nearby places for location:', location);
      const places = await fetchNearbySchools(location.lat(), location.lng(), filter.join(','), 'alla');

      if (places.length > 0) {
        const nearestPlace = places[0];
        const distanceToNearestPlace = calculateDistance(
          location,
          new google.maps.LatLng(nearestPlace.latitude, nearestPlace.longitude)
        );

        if (distanceToNearestPlace > 3) {
          setErrorMessage('För närvarande stödjer vi bara stockholmsområdet. Prova igen!');
          setLoading(false);
          return;
        }

        const detailedResults = await Promise.all(
          places.map(async (place) => {
            const cleanName = place.namn.trim();
            const pdfData = await fetchPdfDataByName(cleanName);

            return {
              ...place,
              pdfData: pdfData || null,
              address: place.adress,
              description: place.beskrivning,
            };
          })
        );

        setNearbyPlaces(detailedResults);
        setAllPlaces(detailedResults);
        clearMarkers();
        detailedResults.forEach((result) => {
          createMarker(result, location);
        });
      } else {
        setErrorMessage('Inga förskolor hittades på den angivna adressen.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      setErrorMessage('Ett fel inträffade vid hämtning av närliggande förskolor.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [map, filter]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter((prevFilter) =>
      prevFilter.includes(value)
        ? prevFilter.filter((item) => item !== value)
        : [...prevFilter, value]
    );
  };

  const extractRelevantAddress = (fullAddress) => {
    const addressParts = fullAddress.split(',');
    return addressParts[0].trim();
  };

  const geocodeAddressHandler = useCallback(async (event) => {
    event.preventDefault();
    const address = document.getElementById('address').value.trim();
    if (!address) {
      setErrorMessage('Ange en giltig adress.');
      return;
    }

    setLoading(true);

    clearMarkers();
    setNearbyPlaces([]);

    const relevantAddress = extractRelevantAddress(address);
    console.log('Relevant address extracted:', relevantAddress);
    const coordinates = await geocodeAddress(relevantAddress);
    console.log('Coordinates:', coordinates);

    if (
      !coordinates ||
      (coordinates.latitude === SERGELSTORG_COORDINATES.latitude &&
        coordinates.longitude === SERGELSTORG_COORDINATES.longitude)
    ) {
      console.log('Geocoding failed or out of bounds.');
      setErrorMessage('För närvarande stödjer vi bara stockholmsområdet. Prova igen.');
      setLoading(false);
      return;
    }

    const { latitude, longitude } = coordinates;
    const location = new google.maps.LatLng(latitude, longitude);

    if (map) {
      map.setCenter(location);
      map.setZoom(14);

      if (originMarker) {
        originMarker.setMap(null);
      }

      const marker = new google.maps.Marker({
        map: map,
        position: location,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(30, 30),
        },
      });

      setOriginMarker(marker);
      setOriginPosition(location);

      await findNearbyPlaces(location);
      setShowPlaces(true);
      setShowText(false);
      setView('map');
      setSearchMade(true);
    } else {
      setErrorMessage('Map is not initialized.');
      setLoading(false);
    }
  }, [map, originMarker, findNearbyPlaces]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      geocodeAddressHandler(event);
    }
  };

  const calculateWalkingTime = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://masterkinder20240523125154.azurewebsites.net/api/Forskolan/walking-time`,
        {
          params: {
            lat1: origin.lat(),
            lon1: origin.lng(),
            lat2: destination.lat,
            lon2: destination.lng,
          },
        }
      );
      const timeInHours = response.data;
      if (typeof timeInHours !== 'number' || isNaN(timeInHours)) {
        console.error('Invalid response for walking time:', response.data);
        return null;
      }
      const timeInMinutes = timeInHours * 60;
      return timeInMinutes;
    } catch (error) {
      console.error('Error calculating walking time:', error);
      return null;
    }
  };

  const createRoute = (destination) => {
    if (!originPosition) {
      console.error('Origin position is not set');
      return;
    }

    const request = {
      origin: originPosition,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.current.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.current.setDirections(result);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  };

  const createMarker = async (place, originLocation) => {
    let iconUrl;

    if (place.organisationsform === 'Kommunal') {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    } else if (place.organisationsform === 'Fristående') {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png';
    } else if (place.organisationsform === 'Föräldrakooperativ') {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    } else {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }

    const marker = new google.maps.Marker({
      map: map,
      position: { lat: place.latitude, lng: place.longitude },
      title: place.namn,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(30, 30),
      },
    });

    const walkingTimeInMinutes = await calculateWalkingTime(originLocation, {
      lat: place.latitude,
      lng: place.longitude,
    });
    const formattedWalkingTime =
      walkingTimeInMinutes !== null && !isNaN(walkingTimeInMinutes)
        ? walkingTimeInMinutes.toFixed(2)
        : 'N/A';

    setWalkingTimes((prevTimes) => ({
      ...prevTimes,
      [place.id]: formattedWalkingTime,
    }));

    marker.addListener('click', () => {
      selectPlace(place);
      createRoute(new google.maps.LatLng(place.latitude, place.longitude));
    });

    setCurrentMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const selectPlace = async (place) => {
    try {
      const cleanName = place.namn.trim();
      const malibuData = await fetchMalibuByName(cleanName);
      if (malibuData) {
        console.log(`Fetched Malibu data for ${cleanName}:`, malibuData);
      } else {
        console.log(`No Malibu data found for ${cleanName}`);
      }
      const relevantAddress = extractRelevantAddress(place.adress);
      const schoolDetails = await fetchSchoolDetailsByAddress(relevantAddress);

      const walkingTime = walkingTimes[place.id];

      const detailedPlace = {
        ...place,
        malibuData: malibuData || null,
        schoolDetails: schoolDetails ? schoolDetails : null,
        walkingTime: walkingTime,
      };

      setSelectedPlace(detailedPlace);
      navigate(`/forskolan/${place.id}`);

      if (originMarker) {
        createRoute(new google.maps.LatLng(place.latitude, place.longitude));
      }
    } catch (error) {
      console.error('Error selecting place:', error);
    }
  };

  const handleCardSelect = (place) => {
    selectPlace(place);
  };

  const clearMarkers = () => {
    currentMarkers.forEach((marker) => marker.setMap(null));
    setCurrentMarkers([]);
  };

  const handleTopRanked = () => {
  if (!originMarker) {
    alert('Ange en adress först.');
    return;
  }

  // Här ser vi till att `topPlaces` är korrekt definierad och inte orsakar felet
  const topPlaces = allPlaces
    .filter(place => place.pdfData && place.pdfData.helhetsomdome !== undefined) // Filtrera bort platser utan omdöme
    .sort((a, b) => b.pdfData.helhetsomdome - a.pdfData.helhetsomdome) // Sortera efter helhetsomdome
    .slice(0, 5); // Välj de fem bästa

  setNearbyPlaces(topPlaces);
  clearMarkers();
  topPlaces.forEach((result) => {
    createMarker(result, originMarker.getPosition());
  });
};


  const filterClosestPreschools = () => {
    if (!originMarker) {
      alert('Ange en adress först.');
      return;
    }

    const sortedPlaces = allPlaces.sort((a, b) => {
      const distanceA = calculateDistance(
        originMarker.getPosition(),
        new google.maps.LatLng(a.latitude, a.longitude)
      );
      const distanceB = calculateDistance(
        originMarker.getPosition(),
        new google.maps.LatLng(b.latitude, b.longitude)
      );

      return distanceA - distanceB;
    });

    const closestPlaces = sortedPlaces.slice(0, 5);

    setNearbyPlaces(closestPlaces);
    clearMarkers();
    closestPlaces.forEach((result) => {
      createMarker(result, originMarker.getPosition());
    });
  };

  const calculateDistance = (origin, destination) => {
    const R = 6371;
    const dLat = (destination.lat() - origin.lat()) * Math.PI / 180;
    const dLng = (destination.lng() - origin.lng()) * Math.PI / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos(origin.lat() * Math.PI / 180) *
        Math.cos(destination.lat() * Math.PI / 180) *
        (1 - Math.cos(dLng))) /
        2;

    return R * 2 * Math.asin(Math.sqrt(a));
  };

  useEffect(() => {
    if (originMarker && map) {
      findNearbyPlaces(originMarker.getPosition());
    }
  }, [filter]);

  useEffect(() => {
    const addressInput = document.getElementById('address');
    const disableMapZoom = () => map.setOptions({ gestureHandling: 'none' });
    const enableMapZoom = () => map.setOptions({ gestureHandling: 'auto' });

    if (addressInput) {
      addressInput.addEventListener('focus', disableMapZoom);
      addressInput.addEventListener('blur', enableMapZoom);
    }

    return () => {
      if (addressInput) {
        addressInput.removeEventListener('focus', disableMapZoom);
        addressInput.removeEventListener('blur', enableMapZoom);
      }
    };
  }, [map]);

  return (
    <div className="app-container">
         {showSplashScreen && <SplashScreen onProceed={() => setShowSplashScreen(false)} />}
         {showText }
       <div className={`search-container ${showPlaces ? 'top' : 'center'}`}>
      <Container maxWidth="sm">
        <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" gap={2}>
          {showPlaces && (
            <Box display="flex" justifyContent="center" width="100%" gap={2}>
              <Button
                onClick={filterClosestPreschools}
                variant="contained"
                color="secondary"
                sx={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                De 5 närmaste
              </Button>
              <Button
                onClick={handleTopRanked}
                variant="contained"
                color="secondary"
                sx={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                Högst rank
              </Button>
              {searchMade && (
                <>
                  <Button
                    onClick={() => setFilterVisible(!filterVisible)}
                    variant="contained"
                    color="primary"
                    sx={{
                      marginTop: '20px',
                      padding: '10px 20px',
                      borderRadius: '50px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {filterVisible ? 'Visa filter' : 'Dölj filter'}
                  </Button>
                  {!filterVisible && (
                    <OrganisationFilter
                      organisationTypes={organisationTypes}
                      filter={filter}
                      handleFilterChange={handleFilterChange}
                      visible={showPlaces}
                      sx={{ marginTop: '20px' }}
                    />
                  )}
                </>
              )}
            </Box>
            )}
           <ButtonGroup variant="contained" aria-label="view toggle button group" style={{ backgroundColor: '#e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
  <Button
    onClick={() => setView('list')}
    style={{
      backgroundColor: view === 'list' ? '#4caf50' : '#ffffff',
      color: view === 'list' ? '#ffffff' : '#4caf50',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px',
      borderRight: '1px solid #e0e0e0',
      fontWeight: view === 'list' ? 'bold' : 'normal',
    }}
  >
    <ListIcon style={{ marginRight: '8px' }} />
    List View
  </Button>
  <Button
    onClick={() => setView('map')}
    style={{
      backgroundColor: view === 'map' ? '#2196f3' : '#ffffff',
      color: view === 'map' ? '#ffffff' : '#2196f3',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px',
      fontWeight: view === 'map' ? 'bold' : 'normal',
    }}
  >
    <MapIcon style={{ marginRight: '8px' }} />
    Map View
  </Button>
</ButtonGroup>

<form onSubmit={geocodeAddressHandler} style={{ width: '100%', marginTop: '20px', position: 'relative' }}>
  <TextField
    id="address"
    variant="outlined"
    placeholder="Skriv din adress för att hitta förskola"
    fullWidth
    sx={{
      color: '#333',
      borderRadius: '50px',
     
      backgroundColor: '#f0f0f0', // Lägg till bakgrundsfärg för hela input-fältet
      'input::placeholder': {
        color: '#666', // Placeholder-färg
        opacity: 1, // Gör färgen synlig
      },
      'input': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Simulera bakgrundsfärg för placeholder
        padding: '10px 20px',
        borderRadius: '50px',
      },
    }}
    inputRef={addressRef}
    onKeyDown={handleKeyDown}
    InputProps={{
      style: { color: '#333', padding: '10px 20px' },
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={geocodeAddressHandler}
            edge="end"
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              borderRadius: '50%',
              padding: '10px',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#45a045',
              },
              marginRight: '-10px',
            }}
          >
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</form>


{!searchMade && (
  <Box sx={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => window.location.href = 'https://blog.förskolekollen.se'}
      sx={{
        padding: '15px 30px',
        fontSize: '16px',
        backgroundColor: '#1a73e8',
        borderRadius: '50px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        '&:hover': {
          backgroundColor: '#1669c1',
        },
        width: '100%',
        maxWidth: '300px',
      }}
    >
      Läs mer om förskolor och regler - Klicka här!
    </Button>

    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate('/Survey')}
      sx={{
        padding: '15px 30px',
        fontSize: '16px',
        backgroundColor: '#1a73e8',
        borderRadius: '50px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        '&:hover': {
          backgroundColor: '#1a73e9',
        },
        width: '100%',
        maxWidth: '300px',
      }}
    >
      Visa enkätsvar och statistik - Klicka här!
    </Button>
  </Box>
)}




          </Box>
        </Container>
      </div>

      {loading && (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      )}

      <div ref={mapRef} className={`map-container ${view === 'list' ? 'hidden' : ''}`}></div>

      <div className={`cards-container ${view === 'map' ? 'hidden' : ''}`}>
        {showPlaces && nearbyPlaces.length > 0 ? (
          nearbyPlaces.map((place) => (
            <PreschoolCard
              key={place.id}
              preschool={place}
              walkingTime={walkingTimes[place.id]}
              onSelect={handleCardSelect}
            />
          ))
        ) : (
          <p></p>
        )}
      </div>

      {selectedPlace && (
        <DetailedCard
          schoolData={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        className="custom-snackbar"
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MapComponent;
