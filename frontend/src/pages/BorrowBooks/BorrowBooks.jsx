import React, { useState, useEffect } from 'react';
import borrowService from '../../services/borrowService';
import userService from '../../services/userService';
import bookService from '../../services/bookService';
import Loader from '../../components/Loader/Loader';
import './BorrowBooks.css';

const BorrowBooks = () => {
  const [borrows, setBorrows] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [formError, setFormError] = useState('');

  // Filter State
  const [filterUserId, setFilterUserId] = useState('');
  const [filterBookId, setFilterBookId] = useState('');

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersData, booksData] = await Promise.all([
        userService.getAllUsers(),
        bookService.getAllBooks()
      ]);
      
      setUsers(usersData);
      setBooks(booksData);
    } catch (err) {
      console.error("Failed to load initial data", err);
      setError("Failed to fetch users or books list. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const loadBorrows = async () => {
    try {
      setError(null);
      let data = [];
      
      if (filterUserId) {
        data = await borrowService.getBorrowedBooksByUser(filterUserId);
      } else if (filterBookId) {
        data = await borrowService.getBorrowedBooksByBook(filterBookId);
      } else {
        data = await borrowService.getBorrowedBooks();
      }
      
      setBorrows(data);
    } catch (err) {
      console.error("Failed to load borrow records", err);
      setError(err.message || "Failed to load borrow records.");
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadBorrows();
  }, [filterUserId, filterBookId]);

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!selectedUserId) {
      setFormError('Please select a member.');
      return;
    }
    if (!selectedBookId) {
      setFormError('Please select a book.');
      return;
    }

    try {
      setSubmitting(true);
      await borrowService.borrowBook(selectedUserId, selectedBookId);
      
      showTemporaryMessage("Book issued successfully!");
      setSelectedUserId('');
      setSelectedBookId('');
      
      // Reload lists to update copies and records
      await Promise.all([
        loadInitialData(),
        loadBorrows()
      ]);
    } catch (err) {
      console.error("Borrow failed", err);
      setFormError(err.message || "Borrow request failed. Verify availability of the book.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      setSubmitting(true);
      setError(null);
      await borrowService.returnBook(borrowId);
      
      showTemporaryMessage("Book returned successfully!");
      
      // Reload lists to update copies and records
      await Promise.all([
        loadInitialData(),
        loadBorrows()
      ]);
    } catch (err) {
      console.error("Return failed", err);
      setError(err.message || "Failed to return the book.");
    } finally {
      setSubmitting(false);
    }
  };

  const showTemporaryMessage = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const availableBooks = books.filter(b => b.availableCopies > 0);

  return (
    <div className="borrow-page">
      <div className="page-header">
        <h1 className="page-title">Issue & Returns Desk</h1>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <span>✅ {successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="borrow-layout">
        {/* Issue Book Form Card */}
        <div className="borrow-form-container card">
          <h3 className="card-subtitle">➕ Issue a Book</h3>
          <form onSubmit={handleBorrowSubmit} className="borrow-desk-form">
            <div className="form-group">
              <label className="form-label" htmlFor="userSelect">Select Subscriber*</label>
              <select
                id="userSelect"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="form-control"
                disabled={submitting}
              >
                <option value="">-- Choose User --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bookSelect">Select Book to Issue*</label>
              <select
                id="bookSelect"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="form-control"
                disabled={submitting}
              >
                <option value="">-- Choose Book --</option>
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} by {b.author} ({b.availableCopies} available)
                  </option>
                ))}
              </select>
              {books.length > 0 && availableBooks.length === 0 && (
                <span className="form-error">All books are currently out of stock.</span>
              )}
            </div>

            {formError && <span className="form-error form-group-error">{formError}</span>}

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? 'Processing Issue...' : 'Issue Book'}
            </button>
          </form>
        </div>

        {/* Filters and List Logs */}
        <div className="borrow-list-container">
          <div className="borrow-filters card">
            <div className="filter-group">
              <label className="form-label">Filter by User</label>
              <select
                value={filterUserId}
                onChange={(e) => {
                  setFilterUserId(e.target.value);
                  setFilterBookId(''); // Clear book filter
                }}
                className="form-control"
              >
                <option value="">All Users</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Filter by Book</label>
              <select
                value={filterBookId}
                onChange={(e) => {
                  setFilterBookId(e.target.value);
                  setFilterUserId(''); // Clear user filter
                }}
                className="form-control"
              >
                <option value="">All Books</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader message="Loading issuance logs..." />
          ) : borrows.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-state-icon">🔄</span>
              <h3>No Active Borrow Records</h3>
              <p>There are no borrow transactions found matching the filter selection.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Subscriber</th>
                      <th>Book Issued</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrows.map((borrow) => {
                      const userName = borrow.userName || borrow.user?.name || 'Unknown User';
                      const bookTitle = borrow.bookTitle || borrow.book?.title || 'Unknown Book';
                      const isReturned = borrow.status === 'RETURNED' || !borrow.dueDate; // If status shows returned
                      
                      return (
                        <tr key={borrow.id}>
                          <td><strong>{userName}</strong></td>
                          <td>{bookTitle}</td>
                          <td>{formatDate(borrow.borrowDate)}</td>
                          <td>{formatDate(borrow.dueDate)}</td>
                          <td>
                            <span className={`badge ${isReturned ? 'badge-success' : 'badge-warning'}`}>
                              {borrow.status || 'BORROWED'}
                            </span>
                          </td>
                          <td>
                            {!isReturned && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleReturn(borrow.id)}
                                disabled={submitting}
                              >
                                Return Book
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowBooks;
