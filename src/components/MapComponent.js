import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import PreschoolCard from './PreschoolCard';
import DetailedCard from './DetailedCard';
import OrganisationFilter from './OrganisationFilter';
import '../styles/GoogleMap.css';
import { TextField, Typography,  Container, Box, CircularProgress, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchSchoolById, fetchNearbySchools,  fetchMalibuByName, fetchSchoolDetailsByAddress } from './api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PreschoolApplicationInfo from './PreschoolApplicationInfo'; // Importera din komponent här
import { ButtonGroup } from '@mui/material';

import MapIcon from '@mui/icons-material/Map';
import schoolIcon from '../images/icons8-school-48.png';
import school from '../images/icons8-school-64.png';
import kooperativ from '../images/icons8-school-building-48.png';

import customIcon from '../images/icons8-children-48.png';

import CustomButton from './CustomButton';
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
  const [view, setView] = useState('map');

  const [walkingTimes, setWalkingTimes] = useState({});

 
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isDetailedCardVisible, setIsDetailedCardVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchMade, setSearchMade] = useState(false); // Används för att visa knappen efter sökning
  
  const [selectedButton, setSelectedButton] = useState(null);
  const handleButtonClick = (view) => {
    setSelectedButton(view);  // Sätt vilken knapp som är vald
    setView(view);  // Uppdatera vilken vy som ska visas (karta eller lista)
  };
  

  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const clustererRef = useRef(null); 
  const [isMapVisible, ] = useState(false);
  
  const handleCardClose = () => {
    // Hantera stängning av PreschoolCard
    setIsCardVisible(false);
    setSelectedPlace(null); // Återställ selectedPlace om kortet stängs
  };

  const handleDetailsClick = async (place) => {
    // Kontrollera om detaljerad data finns för platsen
    if (!place.schoolDetails) {
      // Hämta detaljerad data om den inte finns
      const schoolDetails = await fetchSchoolDetailsByAddress(place.adress);
      place.schoolDetails = schoolDetails;
    }
  
    // Uppdatera det valda stället och visa DetailedCard
    setSelectedPlace(place);
    setIsDetailedCardVisible(true); // Visa DetailedCard
  
    // Navigera till URL med förskolans ID för att uppdatera URL:en korrekt
    navigate(`/forskolan/${place.id}`);
  };
  
const handleMarkerClick = (place, walkingTime) => {
  const detailedPlace = {
    ...place,
    walkingTime: walkingTime || walkingTimes[place.id] || 'N/A',  // Använd walkingTime om tillgänglig, annars hämta från state
  };

  setSelectedPlace(detailedPlace);
  setIsCardVisible(true); // Visa PreschoolCard
};



  const filterPedagogiskOmsorg = async () => {
    if (!originPosition) {
      console.error("Ingen plats vald. Ange en adress.");
      return;
    }
  
    try {
      const lat = originPosition.lat();  // Hämta latitud från positionen
      const lng = originPosition.lng();  // Hämta longitud från positionen
  
      // Hämta förskolor med "Dagmamma" som TypAvService
      const filteredPlaces = await fetchNearbySchools(lat, lng, '', 'pedagogisk omsorg');  // Notera att vi skickar 'Dagmamma' som typAvService
  
      console.log("Filtered Dagmamma places:", filteredPlaces);  // För felsökning
  
      if (filteredPlaces && filteredPlaces.length > 0) {
        setNearbyPlaces(filteredPlaces);  // Uppdatera lista med de filtrerade förskolorna
        clearMarkers();  // Ta bort gamla markörer
        filteredPlaces.forEach((result) => {
          createMarkerWithCustomIcon(result, originPosition, false);  // Skapa markör utan att uppdatera kartans gränser
        });
      } else {
        console.error('Inga förskolor hittades med "Dagmamma" i detta område');
      }
    } catch (error) {
      console.error('Ett fel inträffade vid filtrering av förskolor:', error);
    }
  };
  
  
  const createMarkerWithCustomIcon = async (place, originLocation, shouldUpdateBounds = false) => {
    if (!map) {
      console.error("Map is not initialized yet.");
      return;
    }
  
    const malibuData = await fetchMalibuByName(place.namn);
    const helhetsomdome = malibuData ? malibuData.helhetsomdome : null;
    const cleanedName = place.namn
      .replace(/förskolan/gi, '')
      .replace(/förskola/gi, '')
      .trim();
  
    // Beräkna gångtiden
    const walkingTimeInMinutes = await calculateWalkingTime(originLocation, {
      lat: place.latitude,
      lng: place.longitude,
    });
  
    const formattedWalkingTime = walkingTimeInMinutes ? walkingTimeInMinutes.toFixed(2) : 'N/A';
  
    // Uppdatera walkingTimes state
    setWalkingTimes((prevTimes) => ({
      ...prevTimes,
      [place.id]: formattedWalkingTime,
    }));
  
    // Skapa en markör
    const marker = new google.maps.Marker({
      position: { lat: place.latitude, lng: place.longitude },
      map: map,
      title: cleanedName,
      icon: {
        url: customIcon,
        scaledSize: new google.maps.Size(35, 35),
        labelOrigin: new google.maps.Point(40, 15),
      },
    });
  
    // Skapa InfoWindow för snabb info om förskolan
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="color: black; padding: 1px 3px; font-size: 10px; font-weight: bold; border-radius: 2px; line-height: 1.1em; max-width: 120px; margin: 0;">
          <div style="margin: 0; padding: 0;">${cleanedName}</div>
          <div style="display: flex; align-items: center; margin: 0; padding: 0;">
            <span style="margin-right: 2px;">Betyg:</span>
            ${helhetsomdome ? `${helhetsomdome}% nöjda` : 'Ingen data'}
          </div>
        </div>
      `,
    });
  
    infoWindow.open(map, marker);
  
    // Hantera klick på markören för att visa PreschoolCard med gångtid
    marker.addListener('click', () => {
      handleMarkerClick(place, formattedWalkingTime);  // Passera gångtiden till PreschoolCard
    });
  
    // Lägg till markören i MarkerClusterer
    clustererRef.current.addMarker(marker);
  
    // Uppdatera kartans gränser om det behövs
    if (shouldUpdateBounds) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(marker.position);
      if (originLocation) {
        bounds.extend(originLocation);
      }
      map.fitBounds(bounds);
    }
  
    // Lägg till markören i listan över aktuella markörer
    setCurrentMarkers((prevMarkers) => [...prevMarkers, marker]);
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
      // Hämta förskolan baserat på ID från URL:en
      fetchSchoolById(id).then((school) => {
        if (school) {
          // Sätt vald förskola
          const location = new google.maps.LatLng(school.latitude, school.longitude);
          selectPlace(school); // Detta uppdaterar också selectedPlace
  
          // Centrera kartan på förskolan
          map.setCenter(location);
          map.setZoom(12);
  
          // Skapa en markör för förskolan
          const marker = new google.maps.Marker({
            map: map,
            position: location,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(1, 1),
            },
          });
  
          // Visa DetailedCard om vi har en vald plats
          setIsDetailedCardVisible(true); // Visa DetailedCard
        } else {
          // Om förskolan inte hittas, navigera tillbaka till startsidan
          navigate('/');
        }
      });
    }
  }, [id, map, navigate]);
  

const findNearbyPlaces = useCallback(async (location) => {
  try {
    setLoading(true);
    const places = await fetchNearbySchools(location.lat(), location.lng(), filter.join(','), 'alla');

    if (places.length > 0) {
      const detailedResults = await Promise.all(
        places.map(async (place) => {
          const cleanName = place.namn.trim();
          const pdfData = await fetchMalibuByName(cleanName);
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
    }
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    setErrorMessage('Ett fel inträffade vid hämtning av närliggande förskolor.');
  } finally {
    setLoading(false);
  }
}, [map, filter]);
  const handleFilterChange = (type) => {
    setFilter((prevFilter) =>
      prevFilter.includes(type)
        ? prevFilter.filter((item) => item !== type)
        : [...prevFilter, type]
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
    
    // Kontrollera om geokodningen misslyckades eller om ingen plats hittades
    if (!coordinates) {
      console.log('Geocoding failed or no coordinates found.');
      setErrorMessage('Ogiltig adress, försök igen.');
      setLoading(false);
      return;
    }
  
    const { latitude, longitude } = coordinates;
  
    if (
      latitude === SERGELSTORG_COORDINATES.latitude &&
      longitude === SERGELSTORG_COORDINATES.longitude
    ) {
      console.log('Geocoding returned default coordinates (Sergels Torg).');
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
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(30, 30),
        },
      });
  
      setOriginMarker(marker);
      setOriginPosition(location);
  
      await findNearbyPlaces(location);
      setShowPlaces(true);
     
      setSearchMade(true); // Mark that a search has been made
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
  const createMarker = async (place, originLocation, shouldUpdateBounds = false) => {
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
    const walkingTimeInMinutes = await calculateWalkingTime(originLocation, { lat: place.latitude, lng: place.longitude, });
    const formattedWalkingTime = walkingTimeInMinutes ? walkingTimeInMinutes.toFixed(2) : 'N/A';
  
    // Hämta Malibu-data
    const malibuData = await fetchMalibuByName(place.namn);
    const helhetsomdome = malibuData ? malibuData.helhetsomdome : null;
  
    // Funktion för att generera stjärnor och visa rating bredvid
    const getRatingWithIcon = (rating) => {
      if (rating === null) {
        return 'Ingen data'; // Om inget betyg finns
      }
  
      return `
        <div style="display: flex; align-items: center;">
          <span style="color: gold; font-size: 16px; margin-left: 5px;">★</span> 
          <span style="font-size: 14px; margin-left: 5px;">${rating}%</span> 
          <span style="font-size: 12px; color: gray; margin-left: 5px;">nöjda</span>
        </div>
      `;
    };
  
    // Generera betygsikonen med värde eller visa "Ingen data"
    const ratingContent = getRatingWithIcon(helhetsomdome);
  
    // Ta bort orden "förskola" och "föräldrakooperativet" från namnet om de finns
    const cleanedName = place.namn
      .replace(/förskolan/gi, '') 
      .replace(/förskola/gi, '')
      .replace(/förskolor/gi, '') // Tar bort "förskola"
      .replace(/föräldrakooperativet/gi, '') // Tar bort "föräldrakooperativet"
      .trim();
  
    const marker = new google.maps.Marker({
      position: { lat: place.latitude, lng: place.longitude },
      title: cleanedName,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(30, 30),
        labelOrigin: new google.maps.Point(40, 15),
      },
    });
  
    // Skapa InfoWindow med stjärn-ikon och betyg bredvid "Betyg"
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="color: black; padding: 1px 3px; font-size: 10px; font-weight: bold; border-radius: 2px; line-height: 1.1em; max-width: 120px; margin: 0;">
          <div style="margin: 0; padding: 0;">${cleanedName}</div>
          <div style="display: flex; align-items: center; margin: 0; padding: 0;">
            <span style="margin-right: 2px;">Betyg:</span>
            ${ratingContent}
          </div>
        </div>
      `,
    });
    
    infoWindow.open(map, marker);
  
    marker.addListener('click', () => {
      handleMarkerClick(place, formattedWalkingTime);  // Visa PreschoolCard
    });
  
    clustererRef.current.addMarker(marker);
  
    if (shouldUpdateBounds) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(marker.position);
  
      if (originLocation) {
        bounds.extend(originLocation);
      }
  
      map.fitBounds(bounds);
    }
  
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
    currentMarkers.forEach((marker) => marker.setMap(null));
    clustererRef.current.clearMarkers();
    setCurrentMarkers([]);
  };

  const handleTopRanked = async () => {
    if (!originMarker) {
      alert('Ange en adress först.');
      return;
    }
  
    try {
      // Hämta alla platser och deras Malibu-data
      const detailedPlaces = await Promise.all(
        allPlaces.map(async (place) => {
          const malibuData = await fetchMalibuByName(place.namn.trim());
          return {
            ...place,
            malibuData: malibuData ? malibuData.helhetsomdome : null,
          };
        })
      );
  
      // Filtrera platser som har Malibu-data och sortera efter helhetsomdöme
      const topRankedPlaces = detailedPlaces
        .filter((place) => place.malibuData !== null) // Filtrera bort platser utan Malibu-data
        .sort((a, b) => b.malibuData - a.malibuData) // Sortera efter helhetsomdöme (högst först)
        .slice(0, 5); // Hämta topp 5
  
      // Uppdatera nearbyPlaces och skapa markörer för de topp 5 rankade platserna
      setNearbyPlaces(topRankedPlaces);
      clearMarkers();
  
      topRankedPlaces.forEach((result) => {
        createMarker(result, originMarker.getPosition());
      });
  
    } catch (error) {
      console.error('Error fetching top ranked places:', error);
    }
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
      {/* Uppdatera search-container med dynamisk klass baserat på state */}
      <div className={`search-container ${showPlaces ? 'top' : 'center'} `}>
        <Container maxWidth="l">
          <Box display="flex" alignItems="center" justifyContent="center" gap={0}>
            {showPlaces && (
              <Box
                display="flex"
                justifyContent="flex-start"
                width="100%"
                gap={1}
                sx={{
                  overflowX: 'auto', // Horisontell scroll om det inte får plats
                  whiteSpace: 'nowrap', // Förhindrar radbrytning
                  paddingBottom: '10px',
                }}
              >
                <CustomButton
                  onClick={() => handleButtonClick('map')} // Anropa handleButtonClick för kartvy
                  isSelected={selectedButton === 'map'} // Kontrollera om knappen är vald
                >
                  <MapIcon style={{ marginRight: '8px' }} />
                  Karta
                </CustomButton>
  
               
                <CustomButton
                  onClick={() => filterClosestPreschools()} // Kör filtreringen utan att byta vy
                  isSelected={selectedButton === 'closest'}
                >
                  De 5 närmaste
                </CustomButton>
  
                <CustomButton
                  onClick={() => handleTopRanked()} // Kör rankningen utan att byta vy
                  isSelected={selectedButton === 'rank'}
                >
                  Högst rank
                </CustomButton>
  
                <OrganisationFilter
                  organisationTypes={['Kommunal', 'Fristående', 'Fristående (föräldrakooperativ)']}
                  filter={filter}
                  handleFilterChange={handleFilterChange}
                  onFilterPedagogiskOmsorg={filterPedagogiskOmsorg}
                />
              </Box>
            )}
  
            {searchMade && (
              <ButtonGroup
                aria-label="view toggle button group"
                style={{ borderRadius: '8px', overflow: 'hidden' }}
                sx={{
                  backgroundColor: 'transparent', // Ingen bakgrund för ButtonGroup
                  boxShadow: 'none', // Ingen skugga för ButtonGroup
                  border: 'none', // Ingen kantlinje för ButtonGroup
                }}
              />
            )}
          </Box>
  
          <form onSubmit={geocodeAddressHandler} style={{ width: '100%', marginTop: '5px', position: 'relative' }}>
            <TextField
              id="address"
              variant="outlined"
              placeholder="Skriv din adress för att hitta förskola..."
              fullWidth
              sx={{
                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '& .MuiOutlinedInput-root': {
                  color: '#333',
                  padding: '1px 22px',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 1)',
                  },
                },
                'input::placeholder': {
                  color: '#333',
                  fontSize: '14px',
                },
              }}
              inputRef={addressRef}
              onKeyDown={handleKeyDown}
              InputProps={{
                style: { color: '#333' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={geocodeAddressHandler}
                      edge="end"
                      sx={{
                        backgroundColor: '#ffffff',
                        color: '#62727b',
                        borderRadius: '50%',
                        padding: '8px',
                        '&:hover': {
                          backgroundColor: '#a7c0cd',
                        },
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
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                '@media (max-width: 600px)': {
                  marginTop: '10px',
                  gap: '10px',
                },
              }}
            >
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
                    fontSize: '14px',
                    padding: '15px',
                  },
                }}
              >
                Välkommen till Förskolekollen! Vi hjälper dig att hitta och jämföra förskolor i ditt område. Lär dig mer om regler och riktlinjer samt se enkätsvar och statistik för att göra ett informerat val för ditt barns utbildning. För närvarande stödjer vi bara förskolor i stockholmsområdet. Ange en adress för att komma igång.
              </Typography>
  
              <Box>
                <PreschoolApplicationInfo />
              </Box>
            </Box>
          )}
        </Container>
      </div>
  
      {loading && (
        <div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <CircularProgress style={{ color: '#4CAF50' }} />
        </div>
      )}
{/* Google Maps-kontainern */}
<div ref={mapRef} className={`map-container ${view === 'list' ? 'hidden' : ''}`}></div>

{/* Listvy-kontainern, endast synlig när "list view" är aktiv */}
<div className={`cards-container ${view === 'map' ? 'hidden' : ''}`}>
  {showPlaces && nearbyPlaces.length > 0 ? (
    nearbyPlaces.map((place, index) => (
      <PreschoolCard 
        key={place.id} 
        preschool={place} 
        onSelect={handleCardSelect} 
        onDetailsClick={() => handleDetailsClick(place)} // Hantera "Läs mer"-klick
      />
    ))
  ) : (
    <p>

    </p>
  )}
</div>
{/* PreschoolCard visas ovanpå Google Maps baserat på marker-klick */}
{selectedPlace && isCardVisible && (
  <div style={{ position: 'absolute', bottom: '20%', right: '20%', zIndex: 1000, width: '300px' }}>
    <PreschoolCard
      preschool={selectedPlace}
      walkingTime={selectedPlace.walkingTime} // Skicka gångtiden till PreschoolCard
      onSelect={handleCardSelect}
      onDetailsClick={() => handleDetailsClick(selectedPlace)}
      onClose={handleCardClose}
    />
    {/* Stängningsknapp för PreschoolCard */}
    <button 
      onClick={handleCardClose} 
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        zIndex: 1100, // Högre z-index för att vara ovanpå kortet
      }}
    >
      ❌
    </button>
  </div>
)}


{selectedPlace && isDetailedCardVisible && selectedPlace.schoolDetails && (
  <DetailedCard
    schoolData={selectedPlace}
    onClose={() => setIsDetailedCardVisible(false)} // Stäng DetailedCard
  />
)}

  
  <Snackbar
  open={Boolean(errorMessage)}
  autoHideDuration={6000}
  onClose={() => setErrorMessage('')}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Placerar den i mitten, nära toppen
>
  <Alert 
    onClose={() => setErrorMessage('')} 
    severity="error" 
    sx={{ 
      width: '100%', 
      maxWidth: '400px',  // Begränsar bredden
      margin: '0 auto',  // Gör den centrerad horisontellt
    }}
  >
    {errorMessage}
  </Alert>
</Snackbar>

    </div>
  );
  
  
};

export default MapComponent;