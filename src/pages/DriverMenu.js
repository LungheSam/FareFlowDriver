import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import '../styles/driverMenu.css';
import DriverHeader from '../components/DriverHeader';

const DriverMenu = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const menuItems = [
    { icon: 'bx bx-map', label: 'Dashboard', path: '/dashboard' },
    { icon: 'bx bx-history', label: 'Trip History', path: '/trip-history' },
    { icon: 'bx bx-bell', label: 'Notifications', path: '/notifications' },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="driver-menu">
        <DriverHeader />
      <div className="profile-section card-profile">
        <div className="user-image-profile">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" />
          ) : (
            <i className='bx bx-user'></i>
          )}
        </div>
        <div className='user-profile-content'>
            <h3>{user?.displayName || 'Driver'}</h3>
            <p>{user?.email}</p>
        </div>
        
      </div>

      <div className="profile-menu card-profile">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item" onClick={() => navigate(item.path)}>
            <p>
                <i className={item.icon}></i>
            <span>{item.label}</span>
            </p>
          </div>
        ))}
        <div className="menu-item logout-btn" onClick={handleLogout}>
        <p>
            Logout
        </p>
        
      </div>
      </div>
    </div>
  );
};

export default DriverMenu;

