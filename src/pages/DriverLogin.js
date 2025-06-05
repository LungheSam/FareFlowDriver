// src/pages/DriverLogin.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // reuse the existing style

const DriverLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Check if user exists in 'drivers' collection
      const userDoc = await getDoc(doc(db, 'drivers', user.uid));

      if (!userDoc.exists() || userDoc.data().role !== 'driver') {
        await auth.signOut();
        throw new Error('Access denied. Driver privileges required.');
      }

      // Step 3: Redirect to driver dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'Account disabled';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      case 'auth/invalid-credential':
        return 'Invalid Credentials';
      default:
        return error.message || 'Login failed. Please try again';
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h1 className="login-title">Fare<span>Flow</span></h1>
          <h2>Driver Login</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;
