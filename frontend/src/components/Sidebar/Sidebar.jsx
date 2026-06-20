import React from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../../services/authService';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const user = authService.getCurrentUser();
  const role = user ? user.role : 'USER';
  const userName = user ? user.name : 'Library Member';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">📚</span>
        <div className="brand-info">
          <h2 className="brand-text">LibFlow</h2>
          <span className="brand-role-badge">{role}</span>
        </div>
      </div>
      
      <div className="sidebar-user-welcome">
        <div className="user-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="user-meta">
          <span className="welcome-text">Hello,</span>
          <span className="user-display-name" title={userName}>{userName}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {/* Common Dashboard link */}
        <NavLink 
          to="/" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          end
        >
          <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        {/* LIBRARIAN Menu Items */}
        {role === 'LIBRARIAN' && (
          <>
            <NavLink 
              to="/books" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Books</span>
            </NavLink>

            <NavLink 
              to="/users" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Users</span>
            </NavLink>

            <NavLink 
              to="/borrow" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 9h-6a2 2 0 0 0-2 2v10" />
              </svg>
              <span>Borrow Books</span>
            </NavLink>



            <NavLink 
              to="/reports" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Reports</span>
            </NavLink>
          </>
        )}

        {/* USER Menu Items */}
        {role === 'USER' && (
          <>
            <NavLink 
              to="/books" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Books</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>My Profile</span>
            </NavLink>

            <NavLink 
              to="/my-books" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>My Books</span>
            </NavLink>

            <NavLink 
              to="/my-wishlist" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>My Wishlist</span>
            </NavLink>
          </>
        )}
      </nav>
      
      <div className="sidebar-footer">
        <p className="footer-version">LibFlow v1.0.0</p>
        <p className="footer-status">Connected to Port 8080</p>
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
