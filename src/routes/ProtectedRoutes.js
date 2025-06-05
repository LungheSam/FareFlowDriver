import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'drivers', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role === 'driver') {
          setIsDriver(true);
        } else {
          setIsDriver(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return isDriver ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
