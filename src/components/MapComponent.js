import React, { useEffect, useRef, useState, useCallback } from 'react';
import PreschoolCard from './PreschoolCard';
import DetailedCard from './DetailedCard';
import OrganisationFilter from './OrganisationFilter';
import '../styles/GoogleMap.css';
import { TextField,Typography, Button, Container, Box, CircularProgress, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchSchoolById, fetchNearbySchools, fetchPdfDataByName, fetchMalibuByName, fetchSchoolDetailsByAddress } from './api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
        polylineOptions: {
          strokeColor: '#FF0000', // Ändra färg till röd
          strokeOpacity: 0.7,    // Justera opaciteten om du vill ha en halvgenomskinlig linje
          strokeWeight: 5        // Öka bredden på linjen
        }
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
          map.setZoom(12);

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
          setErrorMessage('Ledsen att komma med tråkiga nyheter. För närvarande stöder vi endast Stockholm Stad. Prova igen!');
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
    setSearchMade(true); // Keep track of search being made
    // Remove or comment out the following line
    // setView('map'); // Don't switch to map view automatically
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
                {filterVisible ? 'Typ av förskola' : 'Typ av förskola'}
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
         {searchMade && (
  <ButtonGroup  aria-label="view toggle button group" style={{  borderRadius: '8px', overflow: 'hidden' }}>
    <Button
      onClick={() => setView('list')}
    style={{
  backgroundColor: view === 'list' ? '#FFB6C1' : '#ffffff', // Använd en ljus rosa färg när view är 'list'
  color: view === 'list' ? '#ffffff' : '#3f1d3ba3',
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
)}


<form onSubmit={geocodeAddressHandler} style={{ width: '100%', marginTop: '5px', position: 'relative' }}>
<TextField
  id="address"
  variant="outlined"
  placeholder="Skriv din adress för att hitta förskola"
  fullWidth
  sx={{
    backgroundColor: '#ffffff', // Helt vit bakgrund för ren och minimalistisk design
    borderRadius: '8px', // Lätt rundade hörn för en modern känsla
    border: '1px solid #e0e0e0', // Tunn grå kant för subtil definition
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // Lätt skugga för subtilt djup
    overflow: 'hidden',
    transition: 'all 0.3s ease', // Smidig övergång för alla interaktioner
    fontFamily: "'Helvetica Neue', sans-serif", // Modern och stilren font
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Ökad skugga vid hover för lite mer djup
    },
    '&:focus-within': {
        borderColor: '#bdbdbd', // Mörkare grå kant vid fokus för tydlig feedback
        boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.1)', // Subtil fokusring för bättre synlighet
    },
    'input::placeholder': {
        color: '#9e9e9e', // Grå färg för placeholder-text för diskret synlighet
        fontStyle: 'italic', // Kursiv stil för att lägga till subtil elegans
        opacity: 1,
        fontFamily: "'Helvetica Neue', sans-serif", // Håller samma font som input
    },
    'input': {
        padding: '12px 16px', // Bekväm padding för användarvänlighet
        fontSize: '16px', // Standard textstorlek för god läsbarhet
        color: '#333333', // Mörkgrå textfärg för hög kontrast
        fontFamily: "'Helvetica Neue', sans-serif", // Samma stilrena font för input text
        transition: 'color 0.3s ease', // Smidig övergång för textfärg vid interaktion
        '&:focus': {
            outline: 'none', // Ingen inbyggd outline vid fokus
            color: '#000000', // Svart färg vid fokus för att maximera läsbarheten
        },
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
              backgroundColor: '#333',
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
{!searchMade && view === 'list' && (
  <Box
    sx={{
      marginTop: '20px', // Minskar avståndet för att flytta upp innehållet lite
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      '@media (max-width: 600px)': {
        marginTop: '10px', // Minskar toppmarginalen ytterligare för små skärmar
        gap: '10px', // Minskar gap mellan elementen för små skärmar
      },
    }}
  >
    {/* Information text */}
    <Typography
      variant="body1"
      sx={{
        maxWidth: '300px',
        textAlign: 'center',
        color: '#333',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        '@media (max-width: 600px)': {
          fontSize: '14px', // Minskar textstorleken för små skärmar
          padding: '15px', // Minskar padding för små skärmar
        },
      }}
    >
      Välkommen till Förskolekollen! Vi hjälper dig att hitta och jämföra förskolor i ditt område. Lär dig mer om regler och riktlinjer samt se enkätsvar och statistik för att göra ett informerat val för ditt barns utbildning.
    </Typography>

    {/* Button to external website */}
    <Button
      variant="contained"
      color="secondary"
      onClick={() => (window.location.href = 'https://blog.förskolekollen.se')}
      sx={{
        padding: '5px 10px',
        fontSize: '16px',
        backgroundColor: 'pink',
        borderRadius: '50px',
        marginTop:'55px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#d6b2e2',
        },
        width: '100%',
        maxWidth: '300px',
        '@media (max-width: 600px)': {
          fontSize: '14px', // Minskar textstorleken för knappen för små skärmar
          padding: '5px 10px', // Minskar padding för små skärmar
        },
      }}
    >
      Läs mer om förskolor och regler
    </Button>

    {/* Button to survey page */}
    
    {/* New button to navigate to preschool application information */}
    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate('/PreschoolApplicationInfo')}
      sx={{
        padding: '5px 10px',
        fontSize: '16px',
        backgroundColor: 'pink',
        color: '#fff',
        marginTop:'40px',
        borderRadius: '50px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        '&:hover': {
          backgroundColor: '#d6b2e2',
        },
        width: '100%',
        maxWidth: '300px',
        '@media (max-width: 600px)': {
          fontSize: '14px', // Minskar textstorleken för knappen för små skärmar
          padding: '5px 10px', // Minskar padding för små skärmar
        },
      }}
    >
      Läs om hur du ansöker till förskola
    </Button>
  </Box>
)}





          </Box>
        </Container>
      </div>

      {loading && (
  <div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
    <CircularProgress style={{ color: '#4CAF50' }} /> {/* Använd valfri färgkod */}
  </div>
)}


      <div ref={mapRef} className={`map-container ${view === 'list' ? 'hidden' : ''}`}></div>
      <div className={`cards-container ${view === 'map' ? 'hidden' : ''}`}>
  {showPlaces && nearbyPlaces.length > 0 ? (
    nearbyPlaces.map((place, index) => (
      <PreschoolCard
        key={place.id}
        preschool={place}
        walkingTime={walkingTimes[place.id]}
        onSelect={handleCardSelect}
        className={index === nearbyPlaces.length - 1 ? 'last-card' : ''} // Lägg till klass om det är sista kortet
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