// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/firebase';
import DriverLogin from './pages/DriverLogin';
import DriverDashboard from './pages/DriverDashboard';
import NotFound from './pages/NotFound';
import DriverLayout from './components/DriverLayout';
import DriverMenu from './pages/DriverMenu';
import NotificationsPage from './pages/Notifications';
import UpdateRoute from './pages/UpdateRoute';
import AddFunds from './pages/AddFunds';

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
          element={user ? <Navigate to="/" replace /> : <DriverLogin />}
        />
        <Route
          path="/"
          element={user ? <DriverLayout /> : <Navigate to="/login" replace />}
        >
          {/* Root path "/" renders the Dashboard */}
          <Route index element={<DriverDashboard />} />
          <Route path="driver-menu" element={<DriverMenu />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="update-route" element={<UpdateRoute />} />
          <Route path="add-funds" element={<AddFunds />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

