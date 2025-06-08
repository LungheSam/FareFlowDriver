// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/not-found.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="not-found-button">Go Home</Link>
      <div className="not-found-leaf">🍃</div>
    </div>
  );
}

export default NotFound;
