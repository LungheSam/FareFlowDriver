import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/driverMenu.css';
import DriverHeader from '../components/DriverHeader';

const DriverMenu = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [driverInfo, setDriverInfo] = useState(null); // NEW




  const menuItems = [
    { icon: 'bx bx-map', label: 'Dashboard', path: '/' },
    { icon: 'bx bx-money', label: 'Recharge for a card', path: '/add-funds' },
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
  useEffect(() => {
  if (!user) return;

  const fetchDriverInfo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'drivers'));
      const driversList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Match by user.uid
      const currentDriver = driversList.find(driver => driver.email === user.email);

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
            <h3>{driverInfo?.firstName || 'Driver'}</h3>
            <p> <strong>{driverInfo?.email}</strong></p>
            <p>{driverInfo?.phone}</p>
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

