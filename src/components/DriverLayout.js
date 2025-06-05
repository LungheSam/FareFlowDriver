import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/driverLayout.css';

const DriverLayout = () => {
  return (
    <div className="driver-layout">
      <Outlet />
    </div>
  );
};

export default DriverLayout;