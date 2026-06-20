import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../../services/authService';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const user = authService.getCurrentUser();
  const role = user ? user.role : 'USER';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">LibFlow</span>
        </NavLink>

        <button className={`menu-toggle ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle Navigation">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              end
            >
              Dashboard
            </NavLink>
          </li>

          {/* LIBRARIAN Menu Items */}
          {role === 'LIBRARIAN' && (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/books" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Books
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/users" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/borrow" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Borrow Books
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink 
                  to="/reports" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Reports
                </NavLink>
              </li>
            </>
          )}

          {/* USER Menu Items */}
          {role === 'USER' && (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/books" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Books
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  My Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/my-books" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  My Books
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/my-wishlist" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  My Wishlist
                </NavLink>
              </li>
            </>
          )}

          <li className="nav-item">
            <button 
              className="nav-link nav-logout-btn" 
              onClick={() => {
                closeMenu();
                onLogout();
              }}
            >
              Logout 🚪
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
