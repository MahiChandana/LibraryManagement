import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import dashboardService from '../../services/dashboardService';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Loader from '../../components/Loader/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    borrowedBooks: 0,
    availableBooks: 0,
    wishlistBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const role = user ? user.role : 'USER';
  const userId = user ? user.id : null;
  const userName = user ? user.name : 'Reader';

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (role === 'LIBRARIAN') {
        data = await dashboardService.getDashboardStats();
      } else {
        data = await dashboardService.getUserDashboardStats(userId);
      }
      
      setStats({
        totalBooks: data.totalBooks !== undefined ? data.totalBooks : 0,
        totalUsers: data.totalUsers !== undefined ? data.totalUsers : 0,
        borrowedBooks: data.borrowedBooks !== undefined ? data.borrowedBooks : 0,
        availableBooks: data.availableBooks !== undefined ? data.availableBooks : 0,
        wishlistBooks: data.wishlistBooks !== undefined ? data.wishlistBooks : 0
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setError(err.message || "Could not retrieve statistics from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Fetching library dashboard statistics..." />;
  }

  // Navigation handlers
  const handleCardClick = (cardType) => {
    if (role === 'LIBRARIAN') {
      switch (cardType) {
        case 'totalBooks':
          navigate('/books');
          break;
        case 'availableBooks':
          navigate('/books?filter=available');
          break;
        case 'borrowedBooks':
          navigate('/borrow');
          break;
        case 'totalUsers':
          navigate('/users');
          break;
        case 'wishlistBooks':
          navigate('/wishlist');
          break;
        default:
          break;
      }
    } else {
      // USER navigation
      switch (cardType) {
        case 'totalBooks':
          navigate('/books');
          break;
        case 'availableBooks':
          navigate('/books?filter=available');
          break;
        case 'borrowedBooks':
          navigate('/my-books');
          break;
        case 'wishlistBooks':
          navigate('/my-wishlist');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="welcome-banner">
          <h1 className="page-title">Welcome back, {userName}!</h1>
          <p className="page-subtitle">Here is the status of the library system today.</p>
        </div>
        <button className="btn btn-secondary refresh-btn" onClick={fetchStats}>
          🔄 Refresh Stats
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Grid of clickable cards */}
      <div className="stats-grid">
        <div className="card-wrapper clickable" onClick={() => handleCardClick('totalBooks')}>
          <DashboardCard 
            title="Total Books" 
            value={stats.totalBooks} 
            theme="primary"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            }
          />
        </div>
        
        <div className="card-wrapper clickable" onClick={() => handleCardClick('availableBooks')}>
          <DashboardCard 
            title="Available Books" 
            value={stats.availableBooks} 
            theme="success"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
        </div>

        <div className="card-wrapper clickable" onClick={() => handleCardClick('borrowedBooks')}>
          <DashboardCard 
            title={role === 'LIBRARIAN' ? "Borrowed Books" : "My Borrowed Books"} 
            value={stats.borrowedBooks} 
            theme="warning"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 9h-6a2 2 0 0 0-2 2v10" />
              </svg>
            }
          />
        </div>

        {role === 'USER' && (
          <div className="card-wrapper clickable" onClick={() => handleCardClick('wishlistBooks')}>
            <DashboardCard 
              title="My Wishlist" 
              value={stats.wishlistBooks} 
              theme="danger"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              }
            />
          </div>
        )}

        {role === 'LIBRARIAN' && (
          <div className="card-wrapper clickable" onClick={() => handleCardClick('totalUsers')}>
            <DashboardCard 
              title="Total Users" 
              value={stats.totalUsers} 
              theme="info"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
          </div>
        )}
      </div>

      {/* Dynamic Quick Actions block based on roles */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="actions-grid">
          {role === 'LIBRARIAN' ? (
            <>
              <div className="action-tile card" onClick={() => navigate('/books')}>
                <span className="tile-emoji">📖</span>
                <div className="tile-details">
                  <h4>Manage Books</h4>
                  <p>Add new titles, update inventories, search or filter current catalog.</p>
                </div>
              </div>

              <div className="action-tile card" onClick={() => navigate('/users')}>
                <span className="tile-emoji">👥</span>
                <div className="tile-details">
                  <h4>Manage Users</h4>
                  <p>Register new readers, edit contact details, view active members list.</p>
                </div>
              </div>

              <div className="action-tile card" onClick={() => navigate('/borrow')}>
                <span className="tile-emoji">🔄</span>
                <div className="tile-details">
                  <h4>Issue & Returns</h4>
                  <p>Lend books, record returns, track pending due dates and borrow history.</p>
                </div>
              </div>



              <div className="action-tile card" onClick={() => navigate('/reports')}>
                <span className="tile-emoji">📈</span>
                <div className="tile-details">
                  <h4>View Reports</h4>
                  <p>Check library charts, stats distributions, and overdue lists.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="action-tile card" onClick={() => navigate('/profile')}>
                <span className="tile-emoji">👤</span>
                <div className="tile-details">
                  <h4>My Profile</h4>
                  <p>View your library subscriber profile details, phone number, and address.</p>
                </div>
              </div>

              <div className="action-tile card" onClick={() => navigate('/my-books')}>
                <span className="tile-emoji">📚</span>
                <div className="tile-details">
                  <h4>My Borrowed Books</h4>
                  <p>Check your list of active loans, due dates, returned history, and remaining days.</p>
                </div>
              </div>

              <div className="action-tile card" onClick={() => navigate('/my-wishlist')}>
                <span className="tile-emoji">💖</span>
                <div className="tile-details">
                  <h4>My Wish-to-Read List</h4>
                  <p>See saved books, check availability status, and instantly checkout available copies.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
