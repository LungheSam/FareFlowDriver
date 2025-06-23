// export default CurrentPassengers;
import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { dbRT } from '../services/firebase';
import { db } from '../services/firebase';
import { doc, getDoc } from "firebase/firestore";
import '../styles/currentpassengers.css';


const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const pad = (n) => String(n).padStart(2, '0');

  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${month}/${day} - ${hours}:${minutes}:${seconds}`;
};

const CurrentPassengers = ({ busId }) => {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    if (busId) {
      const passengersRef = ref(dbRT, `buses/${busId}/passengers`);
      const fetchPassengers = async (snapshot) => {
        if (snapshot.exists()) {
          const passengersData = snapshot.val();
          const passengersList = await Promise.all(
            Object.keys(passengersData).map(async (key) => {
              const passenger = passengersData[key];
              const userRef = doc(db, 'users', passenger.cardUID);
              const userSnap = await getDoc(userRef);
              const user = userSnap.exists() ? userSnap.data() : {};
              return {
                id: key,
                ...passenger,
                user,
              };
            })
          );
          setPassengers(passengersList);
        } else {
          setPassengers([]);
        }
      };

      const unsubscribe = onValue(passengersRef, fetchPassengers);

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
              className={`passenger-item ${passenger.user.balance < passenger.fareAmount ? 'low-balance' : ''}`}
            >
              <div className="passenger-info">
                <p><strong>{passenger.user.firstName} {passenger.user.lastName}</strong></p>
                <p>Card: {passenger.cardUID}</p>
              </div>
              <div className="passenger-fare">
                <p><strong>Boarded:</strong> {formatTimestamp(passenger.timestamp?passenger.timestamp:passenger.startTime)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentPassengers;
