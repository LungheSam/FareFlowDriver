import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, dbRT } from '../services/firebase';
import { ref, onValue, off } from 'firebase/database';
import DriverHeader from '../components/DriverHeader';
import '../styles/notifications.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const notificationsRef = ref(dbRT, `notifications/${user.uid}`);
    onValue(notificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const notificationsData = snapshot.val();
        const notificationsList = Object.keys(notificationsData).map(key => ({
          id: key,
          ...notificationsData[key]
        }));
        setNotifications(notificationsList.reverse()); // Newest first
      }
    });

    return () => off(notificationsRef);
  }, [user, navigate]);

  return (
    <div className="notifications-page">
      <DriverHeader title="Notifications" showBack={true} />
      
      <div className="notifications-container">
        <h2>Your Notifications</h2>
        
        {notifications.length === 0 ? (
          <div className="empty-state">
            <i className='bx bx-bell-off'></i>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.urgent ? 'urgent' : ''}`}
              >
                <div className="notification-icon">
                  {notification.urgent ? (
                    <i className='bx bx-error-circle'></i>
                  ) : (
                    <i className='bx bx-info-circle'></i>
                  )}
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;