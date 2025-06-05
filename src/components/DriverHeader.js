import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import '../styles/driverheader.css';
const DriverHeader = ({ 
  title = 'FareFlow Driver', 
  showBack = false,
  showBusIcon = false
}) => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleProfileClick = () => {
    navigate('/driver-menu');
  };

  return (
    <header className="driver-header">
      <h1 className="header-title" onClick={() => navigate('/dashboard')}>
        {title}
      </h1>
      <div className="header-right">
        <button className="profile-button" onClick={handleProfileClick}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="profile-image" />
          ) : (
            <i className='bx bx-user-circle'></i>
          )}
        </button>
      </div>
    </header>
  );
};

export default DriverHeader;
