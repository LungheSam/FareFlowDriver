import React, { useEffect, useRef, useState } from 'react';
import { ref as dbRef, onValue } from 'firebase/database';
import { dbRT } from '../services/firebase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/busmap.css';

// Fix Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createBusIcon = () => {
  return new L.Icon({
    iconUrl: 'bus.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const BusMap = ({ busId }) => {
  const [busData, setBusData] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const busIcon = createBusIcon();

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Default center location
    const defaultPosition = [0.3296928, 32.5994707];

    mapRef.current = L.map(mapContainerRef.current).setView(defaultPosition, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);
  }, []);

  // Subscribe to bus data and update marker/map
  useEffect(() => {
    if (!busId) return;

    const busRef = dbRef(dbRT, `buses/${busId}`);

    const unsubscribe = onValue(busRef, (snapshot) => {
      const data = snapshot.val();

      if (data?.location?.latitude && data?.location?.longitude) {
        const newLocation = {
          lat: data.location.latitude,
          lng: data.location.longitude,
        };

        setBusData({
          id: busId,
          location: newLocation,
          routeName: `${data.route?.departure || 'Unknown'} -> ${data.route?.destination || 'Unknown'}`,
          departure: data.route?.departure || 'Unknown',
          destination: data.route?.destination || 'Unknown',
          fareAmount: data.route?.fareAmount || 'N/A',
        });

        // If marker doesn't exist, create it
        if (!markerRef.current) {
          markerRef.current = L.marker([newLocation.lat, newLocation.lng], { icon: busIcon })
            .addTo(mapRef.current)
            .bindPopup('Loading...'); // Temporary
        }

        // Update marker position and popup
        markerRef.current.setLatLng([newLocation.lat, newLocation.lng]);
        markerRef.current.setPopupContent(`
          <b>Bus ID:</b> ${busId}<br/>
          <b>Route:</b> ${data.route?.departure || 'Unknown'} → ${data.route?.destination || 'Unknown'}<br/>
          <b>Fare:</b> ${data.route?.fareAmount ? `${data.route.fareAmount} UGX` : 'N/A'}<br/>
          <b>From:</b> ${data.route?.departure || 'Unknown'}<br/>
          <b>To:</b> ${data.route?.destination || 'Unknown'}
        `);

        // Open popup and recenter map on bus
        markerRef.current.openPopup();
        mapRef.current.setView([newLocation.lat, newLocation.lng], mapRef.current.getZoom());
      }
    });

    return () => unsubscribe();
  }, [busId]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '400px', width: '100%' }}
      id="bus-map"
    />
  );
};

export default BusMap;

