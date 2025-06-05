import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { dbRT } from '../services/firebase';
import '../styles/currentpassengers.css';
const CurrentPassengers = ({ busId }) => {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    if (busId) {
      const passengersRef = ref(dbRT, `buses/${busId}/passengers`);
      onValue(passengersRef, (snapshot) => {
        if (snapshot.exists()) {
          const passengersData = snapshot.val();
          const passengersList = Object.keys(passengersData).map(key => ({
            id: key,
            ...passengersData[key]
          }));
          setPassengers(passengersList);
        } else {
          setPassengers([]);
        }
      });
      return () => off(passengersRef);
    }
  }, [busId]);

  return (
    <div className="current-passengers">
      <h3>Current Passengers ({passengers.length})</h3>
      {passengers.length === 0 ? (
        <p>No passengers currently</p>
      ) : (
        <div className="passengers-list">
          {passengers.map((passenger) => (
            <div 
              key={passenger.id} 
              className={`passenger-item ${passenger.balance < passenger.fareAmount ? 'low-balance' : ''}`}
            >
              <div className="passenger-info">
                <p><strong>{passenger.firstName} {passenger.lastName}</strong></p>
                <p>Card: {passenger.cardUID}</p>
              </div>
              <div className="passenger-fare">
                <p>Fare: UGX {passenger.fareAmount || 0}</p>
                <p>Balance: UGX {passenger.balance || 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentPassengers;