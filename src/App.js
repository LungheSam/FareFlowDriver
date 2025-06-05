// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/firebase'; // Make sure this exists
import DriverLogin from './pages/DriverLogin';
import DriverDashboard from './pages/DriverDashboard';
import TripHistory from './pages/TripHistory';
import CurrentTrip from './pages/CurrentTrip';
import NotFound from './pages/NotFound';
import DriverLayout from './components/DriverLayout'; // You can create a layout wrapper like in Admin
import DriverMenu from './pages/DriverMenu';
import NotificationsPage from './pages/Notifications';
import UpdateRoute from './pages/UpdateRoute';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <DriverLogin />}
        />
        <Route
          path="/"
          element={user ? <DriverLayout /> : <Navigate to="/login" replace />}
        >
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="trip-history" element={<TripHistory />} />
          <Route path="current-trip" element={<CurrentTrip />} />
          <Route path="driver-menu" element={<DriverMenu />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="update-route" element={ <UpdateRoute />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
