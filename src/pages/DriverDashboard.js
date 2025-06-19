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
  const [locationWatchId, setLocationWatchId] = useState(null);

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
  const [driverInfo, setDriverInfo] = useState(null); // NEW

useEffect(() => {
  if (!user) return;

  const fetchDriverInfo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'drivers'));
      const driversList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Match by user.uid
      const currentDriver = driversList.find(driver => driver.email === user.email);
      console.log(currentDriver);
      if (currentDriver) {
        setDriverInfo(currentDriver);
      } else {
        console.warn('Driver not found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching driver info:', error);
    }
  };

  fetchDriverInfo();
}, [user]);


  // const startTrip = async () => {
  //   try {
  //     await update(ref(dbRT, `buses/${selectedBus}`), {
  //       status: true
  //     });
  //   } catch (error) {
  //     console.error("Error starting trip:", error);
  //   }
  // };
  const startTrip = async () => {
  try {
    // Update trip status to "started"
    await update(ref(dbRT, `buses/${selectedBus}`), {
      status: true
    });

    // Start location tracking
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Push location update to Realtime DB
          await update(ref(dbRT, `buses/${selectedBus}/location`), {
            latitude,
            longitude,
            // timestamp: Date.now(),
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000
        }
      );

      setLocationWatchId(watchId); // Store to stop later if needed
    } else {
      console.warn("Geolocation not supported in this browser.");
    }
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
        <h2>Welcome, {driverInfo?.firstName || 'Driver'}</h2>
        
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