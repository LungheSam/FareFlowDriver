import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { dbRT } from '../services/firebase';
import '../styles/update-route.css';
import DriverHeader from '../components/DriverHeader';

const UpdateRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { busId } = location.state || {};

  const [routeType, setRouteType] = useState('fixed');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [fareAmount, setFareAmount] = useState('');
  const [vias, setVias] = useState(['']);
  const [viaPrices, setViaPrices] = useState(['']);

  // Fetch existing route data (optional for pre-filling)
  useEffect(() => {
    if (busId) {
      const busRef = ref(dbRT, `buses/${busId}/route`);
      get(busRef).then(snapshot => {
        const route = snapshot.val();
        if (route) {
          setRouteType(route.type || 'fixed');
          setDeparture(route.departure || '');
          setDestination(route.destination || '');
          setFareAmount(route.fareAmount || '');
          setVias(route.vias || ['']);
          setViaPrices(route.viaPrices || ['']);
        }
      });
    }
  }, [busId]);

  const handleViasChange = (index, value) => {
    const updated = [...vias];
    updated[index] = value;
    setVias(updated);
  };

  const handlePriceChange = (index, value) => {
    const updated = [...viaPrices];
    updated[index] = value;
    setViaPrices(updated);
  };

  const addVia = () => {
    setVias([...vias, '']);
    setViaPrices([...viaPrices, '']);
  };

  const removeVia = (index) => {
    const updatedVias = vias.filter((_, i) => i !== index);
    const updatedPrices = viaPrices.filter((_, i) => i !== index);
    setVias(updatedVias);
    setViaPrices(updatedPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departure || !destination || (routeType === 'dynamic' && vias.some(v => !v))) {
      alert("Please fill all required fields.");
      return;
    }

    const routeData = {
      type: routeType,
      departure,
      destination,
      fareAmount: parseInt(fareAmount) || 0,
    };

    if (routeType === 'dynamic') {
      routeData.vias = vias;
      routeData.viaPrices = viaPrices.map(p => parseInt(p) || 0);
    }

    try {
      await update(ref(dbRT, `buses/${busId}/route`), routeData);
      alert('Route updated successfully!');
      navigate(-1);
    } catch (error) {
      console.error("Error updating route:", error);
      alert("Failed to update route.");
    }
  };

  return (
    <div className="update-route-form">
        <DriverHeader title='Update Route' />
      <h2>Update Route for Bus {busId}</h2>

      <form onSubmit={handleSubmit}>
        <label>Route Type</label>
        <select value={routeType} onChange={(e) => setRouteType(e.target.value)}>
          <option value="fixed">Fixed</option>
          <option value="dynamic">Dynamic</option>
        </select>

        <label>Departure</label>
        <input value={departure} onChange={(e) => setDeparture(e.target.value)} required />

        <label>Destination</label>
        <input value={destination} onChange={(e) => setDestination(e.target.value)} required />

        {routeType === 'dynamic' && (
          <>
            <label>Vias</label>
            {vias.map((via, index) => (
              <div key={index} className="via-row">
                <input
                  placeholder={`Via ${index + 1}`}
                  value={via}
                  onChange={(e) => handleViasChange(index, e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={viaPrices[index]}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                />
                <button type="button" onClick={() => removeVia(index)}>Remove</button>
              </div>
            ))}
            <button type="button" className='add-via-button' onClick={addVia}>Add Via</button>
          </>
        )}

        <label>{routeType === 'dynamic' ? "Estimated Fare Amount (Total)" : "Fare Amount"}</label>
        <input
          type="number"
          value={fareAmount}
          onChange={(e) => setFareAmount(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Update Route</button>
      </form>
    </div>
  );
};

export default UpdateRoute;
