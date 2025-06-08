// import React from 'react';
// import PropTypes from 'prop-types';
// import { update, ref } from 'firebase/database';
// import { dbRT } from '../services/firebase';
// import "../styles/bus-details.css";

// const BusDetails = ({ selectedBus, busData, onStartTrip, onUpdateRoute }) => {
//   if (!selectedBus || !busData) return null;

//   const handleEndTrip = async () => {
//     try {
//       await update(ref(dbRT, `buses/${selectedBus}`), { status: false });
//     } catch (error) {
//       console.error("Error ending trip:", error);
//     }
//   };

//   return (
//     <div className="bus-details">
//       <div className="bus-info">
//         <p><strong>Plate:</strong> {selectedBus}</p>
//         <p><strong>Route Type:</strong> {busData.route?.type || 'Not set'}</p>
//         <p><strong>Current Route:</strong> {busData.route?.departure} → {busData.route?.destination}</p>
//         <p><strong>Fare Amount:</strong> UGX {busData.route?.fareAmount || 0}</p>
//         <p><strong>Status:</strong> {busData.status ? 'Active' : 'Inactive'}</p>
//       </div>

//       <div className="dashboard-actions">
//         {!busData.status ? (
//           <button onClick={onStartTrip} className="action-button primary">
//             Start Trip
//           </button>
//         ) : (
//           <button onClick={handleEndTrip} className="action-button warning">
//             End Trip
//           </button>
//         )}
//         <button onClick={onUpdateRoute} className="action-button secondary">
//           Update Route
//         </button>
//       </div>
//     </div>
//   );
// };

// BusDetails.propTypes = {
//   selectedBus: PropTypes.string.isRequired,
//   busData: PropTypes.object,
//   onStartTrip: PropTypes.func.isRequired,
//   onUpdateRoute: PropTypes.func.isRequired,
// };

// export default BusDetails;

import React from 'react';
import PropTypes from 'prop-types';
import { update, ref } from 'firebase/database';
import { dbRT } from '../services/firebase';
import '../styles/bus-details.css';

const BusDetails = ({ selectedBus, busData, onStartTrip, onUpdateRoute }) => {
  if (!selectedBus || !busData) return null;

  const handleEndTrip = async () => {
    try {
      await update(ref(dbRT, `buses/${selectedBus}`), { status: false });
    } catch (error) {
      console.error('Error ending trip:', error);
    }
  };

  const route = busData.route || {};
  const isDynamic = route.type === 'dynamic';
  const vias = route.vias || [];
  const viaPrices = route.viaPrices || [];

  const formatRoutePath = () => {
    if (!route.departure || !route.destination) return 'Incomplete route';

    if (!isDynamic || vias.length === 0) {
      return `${route.departure} → ${route.destination}`;
    }

    const viaSegments = vias.map((via, index) => {
      const price = viaPrices[index] || 0;
      return `${via} (${price} UGX)`;
    });

    return `${route.departure} → ${viaSegments.join(' → ')} → ${route.destination}`;
  };

  return (
    <div className="bus-details">
      <div className="bus-info">
        <p><strong>Plate:</strong> {selectedBus}</p>
        <p><strong>Route Type:</strong> {route.type || 'Not set'}</p>
        <p><strong>Current Route:</strong> {formatRoutePath()}</p>
        <p><strong>Fare Amount:</strong> ~ UGX {route.fareAmount || 0}</p>
        <p><strong>Status:</strong> {busData.status ? 'Active' : 'Inactive'}</p>
      </div>

      <div className="dashboard-actions">
        {!busData.status ? (
          <button onClick={onStartTrip} className="action-button primary">
            Start Trip
          </button>
        ) : (
          <button onClick={handleEndTrip} className="action-button warning">
            End Trip
          </button>
        )}
        <button onClick={onUpdateRoute} className="action-button secondary">
          Update Route
        </button>
      </div>
    </div>
  );
};

BusDetails.propTypes = {
  selectedBus: PropTypes.string.isRequired,
  busData: PropTypes.object,
  onStartTrip: PropTypes.func.isRequired,
  onUpdateRoute: PropTypes.func.isRequired,
};

export default BusDetails;
