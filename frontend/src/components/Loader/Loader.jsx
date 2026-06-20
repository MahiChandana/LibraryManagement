import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading...', overlay = false }) => {
  return (
    <div className={`loader-container ${overlay ? 'overlay' : ''}`}>
      <div className="loader-card">
        <div className="spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
