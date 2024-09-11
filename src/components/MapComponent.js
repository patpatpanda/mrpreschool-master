import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import PreschoolCard from './PreschoolCard';
import DetailedCard from './DetailedCard';
import OrganisationFilter from './OrganisationFilter';
import '../styles/GoogleMap.css';
import { TextField, Typography, Button, Container, Box, CircularProgress, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchSchoolById, fetchNearbySchools, fetchPdfDataByName, fetchMalibuByName, fetchSchoolDetailsByAddress } from './api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PreschoolApplicationInfo from './PreschoolApplicationInfo'; // Importera din komponent här
import { ButtonGroup } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';
import schoolIcon from '../images/icons8-school-48.png';
import school from '../images/icons8-school-64.png';
import kooperativ from '../images/icons8-school-building-48.png';
import hus from '../images/icons8-start-94.png';
import StyledBtn from './StyledBtn';
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
  const [searchMade, setSearchMade] = useState(false); // Används för att visa knappen efter sökning
  const [filterVisible, setFilterVisible] = useState(true);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const clustererRef = useRef(null); 
  const [isMapVisible, setIsMapVisible] = useState(false);
  
  const [isSearchContainerVisible, setIsSearchContainerVisible] = useState(true);
  const filterPedagogiskOmsorg = async () => {
    if (!originPosition) {
      console.error("Ingen plats vald. Ange en adress.");
      return;
    }
  
    try {
      const lat = originPosition.lat();  // Hämta latitud från positionen
      const lng = originPosition.lng();  // Hämta longitud från positionen
  
      // Hämta förskolor med "Pedagogisk omsorg" som är nära användarens plats
      const filteredPlaces = await fetchNearbySchools(lat, lng, '', 'Pedagogisk omsorg');
  
      // Kontrollera om resultatet inte är tomt
      if (filteredPlaces && filteredPlaces.length > 0) {
        setNearbyPlaces(filteredPlaces);  // Uppdatera lista med de filtrerade förskolorna
        clearMarkers();
        filteredPlaces.forEach((result) => {
          createMarker(result, originPosition);
        });
      } else {
        console.error('Inga förskolor hittades med "Pedagogisk omsorg" i detta område');
      }
    } catch (error) {
      console.error('Ett fel inträffade vid filtrering av förskolor:', error);
    }
  };
  
  
  
  
  useEffect(() => {
    // Ställ in body overflow-y baserat på om kartvyn är aktiv eller inte
    if (view === 'map') {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    // Rensa upp när komponenten avmonteras eller när tillståndet ändras
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [isMapVisible,view]);

  // Funktion för att toggla synligheten
  const toggleSearchContainerVisibility = () => {
    setIsSearchContainerVisible(!isSearchContainerVisible);
  };

  const organisationTypes = ['Kommunal', 'Fristående', 'Fristående (föräldrakooperativ)'];

  useEffect(() => {
    const initMap = () => {
      const stockholm = new google.maps.LatLng(59.3293, 18.0686);
      const styles = [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'administrative.neighborhood',
          stylers: [{ visibility: 'off' }],
        },
      ];
      const map = new google.maps.Map(mapRef.current, {
        center: stockholm,
        zoom: 12,
        disableDefaultUI: true,
        styles: styles,
      });
  
      setMap(map);
      clustererRef.current = new MarkerClusterer({ map, markers: [] });
  
      directionsService.current = new google.maps.DirectionsService();
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#007BFF',
          strokeOpacity: 0.5,
          strokeWeight: 4,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#007BFF',
              fillOpacity: 1,
              strokeColor: '#007BFF',
              strokeOpacity: 1,
              scale: 4,
            },
            offset: '0',
            repeat: '20px',
          }]
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbJmqNnZHTZ99pPQ2uHfkDXwpMxOpfYLw
&libraries=places`;
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

                // Lägg till en kontroll för när `setView('map')` ska anropas
                if (window.location.pathname.includes('map')) {
                    setView('map');
                }
                // Alternativt, kontrollera om det finns en specifik anledning att byta till map view
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

    // Försök att geokoda adressen
    const coordinates = await geocodeAddress(relevantAddress);

    if (!coordinates) {
      setErrorMessage('Ogiltig adress, försök igen.');
      setLoading(false);
      return;
    }

    const { latitude, longitude } = coordinates;

    if (
      latitude === SERGELSTORG_COORDINATES.latitude &&
      longitude === SERGELSTORG_COORDINATES.longitude
    ) {
      setErrorMessage('För närvarande stödjer vi bara stockholmsområdet. Prova igen.');
      setLoading(false);
      return;
    }

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
         url: hus, 
          scaledSize: new google.maps.Size(35, 35),
        },
      });

      setOriginMarker(marker);
      setOriginPosition(location);

      // Skapa en instans av LatLngBounds
      const bounds = new google.maps.LatLngBounds();

      // Hitta förskolor och skapa markörer
      await findNearbyPlaces(location);

      // Efter att alla förskolor har laddats, utvidga bounds och autozoom
      nearbyPlaces.forEach((place) => {
        bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
      });

      // Lägg även till användarens plats (origin)
      bounds.extend(location);

      // Autozoom kartan för att inkludera alla markörer
      map.fitBounds(bounds);

      // Kontrollera om zoomnivån är för hög och justera den
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom() > 15) {
          map.setZoom(15); // Ställ in en maxzoom om den är för inzoomad
        }
      });

      setShowPlaces(true);
      setShowText(false);
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
      iconUrl = schoolIcon;
    } else if (place.organisationsform === 'Fristående') {
      iconUrl = school;
    } else if (place.organisationsform === 'Föräldrakooperativ') {
      iconUrl = kooperativ;
    } else {
      iconUrl = kooperativ;
    }

    const marker = new google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        title: place.namn,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(30, 30),
          labelOrigin: new google.maps.Point(40, 15),
        },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="color: black; padding: 2px 5px; font-size: 12px; font-weight: bold; border-radius: 3px; line-height: 1.2em; max-height: 50px; overflow: hidden;">${place.namn}</div>`,
  });
  
    infoWindow.open(map, marker);

    // Lägg till varje markörs position i bounds
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(marker.position);

    clustererRef.current.addMarker(marker);

    // Om du har originLocation kan du även inkludera den i bounds
    if (originLocation) {
        bounds.extend(originLocation);
    }

    // Autozooma kartan för att inkludera alla markörer
    map.fitBounds(bounds);

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

  const selectPlace = async (place, changeView = false) => {
    try {
        const cleanName = place.namn.trim();
        const malibuData = await fetchMalibuByName(cleanName);
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

        // Ändra vy till 'map' endast om `changeView` är sant
        if (changeView) {
            setView('map');
        }

    } catch (error) {
        console.error('Error selecting place:', error);
    }
};

  
  
  const handleCardSelect = (place) => {
    selectPlace(place, false);  // Skicka `false` för att inte ändra till 'map view'
  };

  const clearMarkers = () => {
    // Clear all markers from the map
    currentMarkers.forEach((marker) => marker.setMap(null));
  
    // Clear all markers from the clusterer
    clustererRef.current.clearMarkers();
  
    // Clear the currentMarkers array
    setCurrentMarkers([]);
  };
  

  const handleTopRanked = () => {
    if (!originMarker) {
      alert('Ange en adress först.');
      return;
    }

    const topPlaces = allPlaces
      .filter(place => place.pdfData && place.pdfData.helhetsomdome !== undefined)
      .sort((a, b) => b.pdfData.helhetsomdome - a.pdfData.helhetsomdome)
      .slice(0, 5);

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
      {showText}
      {/* Visa knappen endast om en sökning har gjorts */}
      

      {searchMade && (
  <StyledBtn onClick={toggleSearchContainerVisibility}>
  {isSearchContainerVisible ? 'Dölj filter' : 'Visa filter'}
</StyledBtn>
)}


      {/* Uppdatera search-container med dynamisk klass baserat på state */}
      <div className={`search-container ${showPlaces ? 'top' : 'center'} ${isSearchContainerVisible ? '' : 'no'}`}>
        <Container maxWidth="sm">
    <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" gap={2}>
      {showPlaces && (
        <Box display="flex" justifyContent="center" width="100%" gap={2}>
          <Button
            onClick={filterClosestPreschools}
            variant="contained"
            color="secondary"
            sx={{
              marginTop: '40px',
              background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',  // Vit till ljusgrå gradient bakgrund
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
  marginTop: '40px',
  padding: '10px 20px',
  borderRadius: '50px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',  // Vit till ljusgrå gradient bakgrund
  transition: 'none',  // Förhindrar ändringar vid interaktioner
  ':active': {
    transform: 'none',  // Förhindrar förändringar vid aktivt klick
  },
  ':hover': {
    transform: 'none',  // Förhindrar förändringar vid hover
  },
  ':focus': {
    outline: 'none',  // Förhindrar fokusramen som kan ändra form
  },
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
                  marginTop: '40px',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',  // Vit till ljusgrå gradient bakgrund
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  transition: 'none',  // Förhindrar ändringar vid interaktioner
                  ':active': {
                    transform: 'none',  // Förhindrar förändringar vid aktivt klick
                  },
                  ':hover': {
                    transform: 'none',  // Förhindrar förändringar vid hover
                  },
                  ':focus': {
                    outline: 'none',  // Förhindrar fokusramen som kan ändra form
                  },
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
              onFilterPedagogiskOmsorg={filterPedagogiskOmsorg}  // Lägg till detta
              sx={{ marginTop: '20px' }}
            />
            
                  )}
                </>
              )}
            </Box>
            )}
  {searchMade && (
 <ButtonGroup
 aria-label="view toggle button group"
 style={{ borderRadius: '8px', overflow: 'hidden' }}
 sx={{
   backgroundColor: 'transparent',  // Ingen bakgrund för ButtonGroup
   boxShadow: 'none',               // Ingen skugga för ButtonGroup
   border: 'none',                  // Ingen kantlinje för ButtonGroup
 }}
>
 <Button
   onClick={() => {
     setView('map');
     setIsMapVisible(true);  // Sätt till true när kartan är synlig
   }}
   variant="contained"
   sx={{
     backgroundColor: view === 'map' ? 'lightgrey' : '#ffffff',  // Rosa bakgrund om aktiv, annars vit
     color: view === 'map' ? '#ffffff' : '#333',  // Vit text om aktiv, annars mörkgrå
     display: 'flex',
     background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',  // Vit till ljusgrå gradient bakgrund
     alignItems: 'center',
     justifyContent: 'center',
     padding: '10px 20px',
     fontFamily: 'Nunito, sans-serif',
     border: '2px solid #333',  // Fullständig definition av kantlinje: 2px bredd, solid stil, mörkgrå färg
     boxShadow: 'none',  // Ingen skugga för knappen
     width: '120px',  // Fixad bredd för att matcha alla knappar
     borderRadius: '8px',  // Rundade hörn
     '&:hover': {
       backgroundColor: 'lightgrey',  // Ljusare rosa vid hover
     },
   }}
 >
   <MapIcon style={{ marginRight: '8px' }} />
   Karta
 </Button>
 <Button
   onClick={() => {
     setView('list');
     setIsMapVisible(false);  // Sätt till false när kartan inte är synlig
   }}
   variant="contained"
   sx={{
     backgroundColor: view === 'list' ? 'lightgrey' : '#ffffff',  // Rosa bakgrund om aktiv, annars vit
     color: view === 'list' ? '#ffffff' : '#333',  // Vit text om aktiv, annars mörkgrå
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     padding: '10px 20px',
     background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',  // Vit till ljusgrå gradient bakgrund
     fontFamily: 'Nunito, sans-serif',
     border: '2px solid #333',  // Fullständig definition av kantlinje: 2px bredd, solid stil, mörkgrå färg
     boxShadow: 'none',  // Ingen skugga för knappen
     width: '120px',  // Fixad bredd för att matcha alla knappar
     borderRadius: '8px',  // Rundade hörn
     '&:hover': {
       backgroundColor: 'lightgrey',  // Ljusare rosa vid hover
     },
   }}
 >
   <ListIcon style={{ marginRight: '8px' }} />
   Lista
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
    color:'#333',
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
        maxWidth: '600px',
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
      Välkommen till Förskolekollen! Vi hjälper dig att hitta och jämföra förskolor i ditt område. Lär dig mer om regler och riktlinjer samt se enkätsvar och statistik för att göra ett informerat val för ditt barns utbildning. För närvarande stödjer vi bara förskolor i stockholmsområdet.
      Ange en adress för att komma igång.
    </Typography>

    {/* Button to external website */}
    

    {/* Button to survey page */}
    
    {/* New button to navigate to preschool application information */}
    <Box>
      {/* Visa direkt komponenten med texten */}
      <PreschoolApplicationInfo />
    </Box>
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
                onSelect={handleCardSelect}  // För att inte växla till kartvy
            />
        ))
    ) : (
        <p></p>
    )}
</div>


      {selectedPlace && (
       <DetailedCard
       schoolData={selectedPlace}
       onClose={() => setSelectedPlace(null)} // Kontrollera att detta inte triggar `setView('map')`
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