import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import borrowService from '../../services/borrowService';
import Loader from '../../components/Loader/Loader';
import './MyBooks.css';

const MyBooks = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = authService.getCurrentUser();
  const userId = currentUser ? currentUser.id : null;

  const fetchBorrowedBooks = async () => {
    if (!userId) {
      setError("User session not found.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await borrowService.getBorrowedBooksByUser(userId);
      setBorrows(data);
    } catch (err) {
      console.error("Error fetching borrowed books", err);
      setError("Failed to load your borrowing records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, [userId]);

  // Date formatter helper
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Get actual return date or expected return date (borrowDate + 14 days)
  const getReturnDateText = (borrow) => {
    if (borrow.status === 'RETURNED' || borrow.returnDate) {
      return formatDate(borrow.returnDate);
    }
    if (borrow.borrowDate) {
      const bDate = new Date(borrow.borrowDate);
      const expectedDate = new Date(bDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      return formatDate(expectedDate);
    }
    return '—';
  };

  const getStatusBadge = (borrow) => {
    if (borrow.status === 'RETURNED' || borrow.returnDate) {
      return <span className="badge badge-success">Returned</span>;
    }

    // Check if overdue based on borrowDate + 14 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (borrow.borrowDate) {
      const bDate = new Date(borrow.borrowDate);
      const expectedDate = new Date(bDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      expectedDate.setHours(0, 0, 0, 0);

      if (expectedDate.getTime() < today.getTime()) {
        return <span className="badge badge-danger">Overdue</span>;
      }
    }

    return <span className="badge badge-warning">Borrowed</span>;
  };

  return (
    <div className="my-books-page">
      <div className="page-header">
        <h1 className="page-title">My Borrowed Books</h1>
        <button className="btn btn-secondary refresh-btn" onClick={fetchBorrowedBooks}>
          🔄 Refresh List
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading ? (
        <Loader message="Loading your borrowed books list..." />
      ) : borrows.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-state-icon">📖</span>
          <h3>No Borrowed Books</h3>
          <p>You do not have any borrowed books in your account history yet. Browse our books catalog to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((borrow) => {
                  return (
                    <tr key={borrow.id}>
                      <td>
                        <strong>{borrow.bookTitle || 'Unknown Book'}</strong>
                      </td>
                      <td>{formatDate(borrow.borrowDate)}</td>
                      <td>{getReturnDateText(borrow)}</td>
                      <td>{getStatusBadge(borrow)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
