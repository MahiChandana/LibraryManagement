import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login/Login';
import AppRoutes from './routes/AppRoutes';
import authService from './services/authService';
import './styles/index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    // Check if session changes on load
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="app-container">
          <Navbar onLogout={handleLogout} />
          <Sidebar onLogout={handleLogout} />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
