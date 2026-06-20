import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import authService from '../services/authService';

// Librarian Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import Books from '../pages/Books/Books';
import Users from '../pages/Users/Users';
import BorrowBooks from '../pages/BorrowBooks/BorrowBooks';
import Reports from '../pages/Reports/Reports';

// User Pages
import Profile from '../pages/Profile/Profile';
import MyBooks from '../pages/MyBooks/MyBooks';
import MyWishlist from '../pages/MyWishlist/MyWishlist';

const AppRoutes = () => {
  const user = authService.getCurrentUser();
  const role = user ? user.role : null;

  if (role === 'LIBRARIAN') {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/users" element={<Users />} />
        <Route path="/borrow" element={<BorrowBooks />} />
        <Route path="/reports" element={<Reports />} />
        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else if (role === 'USER') {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/my-wishlist" element={<MyWishlist />} />
        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    // If not logged in, force redirect to root (where App.jsx will render Login)
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
};

export default AppRoutes;
