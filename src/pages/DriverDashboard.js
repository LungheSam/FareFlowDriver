import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, dbRT } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, onValue, off, update } from 'firebase/database';
import DriverHeader from '../components/DriverHeader';
import BusMap from '../components/BusMap';
import CurrentPassengers from '../components/CurrentPassenger';
import BusDetails from '../components/BusDetails';
import '../styles/driver-dashboard.css';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('UAZ-123');
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData,setUserData]=useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBuses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "buses"));
        const busesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBuses(busesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching buses:", error);
        setLoading(false);
      }
    };

    fetchBuses();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedBus) {
      const busRef = ref(dbRT, `buses/${selectedBus}`);
      onValue(busRef, (snapshot) => {
        setBusData(snapshot.val());
      });
      return () => off(busRef);
    }
  }, [selectedBus]);

  const startTrip = async () => {
    try {
      await update(ref(dbRT, `buses/${selectedBus}`), {
        status: true
      });
      // navigate('/current-trip');
    } catch (error) {
      console.error("Error starting trip:", error);
    }
  };

  const updateRoute = () => {
    navigate('/update-route', { state: { busId: selectedBus } });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <DriverHeader />
        <p>Loading buses...</p>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <DriverHeader showBusIcon={true} />
      
      <div className="dashboard-content">
        <h2>Welcome, {user?.firstName || 'Driver'}</h2>
        
        <div className="bus-selection">
          <label htmlFor="bus-select"></label>
          <select 
            id="bus-select"
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            className="bus-select"
          >
            <option value="">-- Select a bus --</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.plateNumber}
              </option>
            ))}
          </select>
        </div>

        {selectedBus && busData && (
          <>
            <BusDetails 
                  selectedBus={selectedBus} 
                  busData={busData} 
                  onStartTrip={startTrip} 
                  onUpdateRoute={updateRoute}
                />

            <div className='bus-map-container'>
              <h2>Current Bus Location</h2>
              <BusMap busId={selectedBus} />
            </div>
            <CurrentPassengers busId={selectedBus} />
          </>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;