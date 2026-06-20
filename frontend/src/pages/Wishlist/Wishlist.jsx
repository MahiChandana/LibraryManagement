import React, { useState, useEffect } from 'react';
import wishlistService from '../../services/wishlistService';
import userService from '../../services/userService';
import bookService from '../../services/bookService';
import Loader from '../../components/Loader/Loader';
import './Wishlist.css';

const Wishlist = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // Page states
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Quick Add Form State
  const [quickBookId, setQuickBookId] = useState('');
  const [formError, setFormError] = useState('');

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
      
      // Auto-select first user if available
      if (usersData.length > 0) {
        setSelectedUserId(usersData[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to fetch initial dropdowns data", err);
      setError("Failed to load users list. Please verify server connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    if (!selectedUserId) {
      setWishlistItems([]);
      return;
    }
    try {
      setListLoading(true);
      setError(null);
      const data = await wishlistService.getWishlistByUser(selectedUserId);
      setWishlistItems(data);
    } catch (err) {
      console.error("Error loading user wishlist", err);
      setError(err.message || "Failed to load wishlist items.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [selectedUserId]);

  const handleAddWishlistSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedUserId) {
      setFormError('Please select a user first.');
      return;
    }
    if (!quickBookId) {
      setFormError('Please select a book.');
      return;
    }

    // Check if book already in wishlist to prevent redundant items
    const alreadyExists = wishlistItems.some(
      item => (item.bookId?.toString() === quickBookId || item.book?.id?.toString() === quickBookId)
    );
    if (alreadyExists) {
      setFormError('This book is already in the selected user\'s wishlist.');
      return;
    }

    try {
      setActionLoading(true);
      await wishlistService.addToWishlist(selectedUserId, quickBookId);
      showTemporaryMessage("Added to wishlist successfully!");
      setQuickBookId('');
      loadWishlist();
    } catch (err) {
      console.error("Failed to add to wishlist", err);
      setFormError(err.message || "Failed to add book to wishlist.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (wishlistId) => {
    try {
      setActionLoading(true);
      setError(null);
      await wishlistService.removeFromWishlist(wishlistId);
      showTemporaryMessage("Removed from wishlist!");
      loadWishlist();
    } catch (err) {
      console.error("Failed to remove item", err);
      setError(err.message || "Failed to remove wishlist item.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBorrow = async (wishlistId, title = 'book') => {
    try {
      setActionLoading(true);
      setError(null);
      await wishlistService.borrowFromWishlist(wishlistId);
      showTemporaryMessage(`Success! Borrowed "${title}" directly from wishlist!`);
      loadWishlist();
    } catch (err) {
      console.error("Failed to borrow from wishlist", err);
      setError(err.message || "Borrow failed. Verify copies availability for this book.");
    } finally {
      setActionLoading(false);
    }
  };

  const showTemporaryMessage = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const selectedUserObject = users.find(u => u.id.toString() === selectedUserId);

  return (
    <div className="wishlist-page">
      <div className="page-header">
        <h1 className="page-title">Reader Wishlists</h1>
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

      {loading ? (
        <Loader message="Setting up wishlist environment..." />
      ) : (
        <div className="wishlist-layout">
          {/* Wishlist management side */}
          <div className="wishlist-content-column">
            {/* User context selector */}
            <div className="user-selector-card card">
              <div className="form-group">
                <label className="form-label" htmlFor="wishlistUserSelect">Select Reader Profile</label>
                <select
                  id="wishlistUserSelect"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="form-control"
                  disabled={actionLoading}
                >
                  <option value="">-- Choose User --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List entries */}
            {listLoading ? (
              <Loader message="Retrieving subscriber wishlist..." />
            ) : !selectedUserId ? (
              <div className="empty-state card">
                <span className="empty-state-icon">💖</span>
                <h3>Select a User</h3>
                <p>Choose a subscriber profile from the dropdown to manage or view their Wish-to-Read wishlist.</p>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="empty-state card">
                <span className="empty-state-icon">💭</span>
                <h3>Wishlist is Empty</h3>
                <p>This user does not have any books saved to read. Add some items using the quick action form.</p>
              </div>
            ) : (
              <div className="table-container">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Subscriber</th>
                        <th>Book Title</th>
                        <th>Date Saved</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlistItems.map((item) => {
                        const userName = selectedUserObject?.name || item.userName || item.user?.name || 'Reader';
                        const bookTitle = item.bookTitle || item.book?.title || 'Unknown Book';
                        
                        return (
                          <tr key={item.id}>
                            <td><strong>{userName}</strong></td>
                            <td>{bookTitle}</td>
                            <td>{formatDate(item.addedDate)}</td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleBorrow(item.id, bookTitle)}
                                  disabled={actionLoading}
                                >
                                  Borrow Book
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemove(item.id)}
                                  disabled={actionLoading}
                                >
                                  Remove
                                </button>
                              </div>
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

          {/* Quick additions side panel */}
          <div className="wishlist-form-column card">
            <h3 className="card-subtitle">💖 Save Book to Wishlist</h3>
            {selectedUserId ? (
              <form onSubmit={handleAddWishlistSubmit} className="quick-wishlist-form">
                <p className="form-helper-text">
                  Add a book to the wishlist of <strong>{selectedUserObject?.name || 'selected user'}</strong>:
                </p>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="quickBookSelect">Select Book*</label>
                  <select
                    id="quickBookSelect"
                    value={quickBookId}
                    onChange={(e) => setQuickBookId(e.target.value)}
                    className="form-control"
                    disabled={actionLoading}
                  >
                    <option value="">-- Choose Book --</option>
                    {books.map(b => (
                      <option key={b.id} value={b.id}>{b.title} by {b.author}</option>
                    ))}
                  </select>
                </div>

                {formError && <span className="form-error form-group-error">{formError}</span>}

                <button type="submit" className="btn btn-primary w-100" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Add to Wishlist'}
                </button>
              </form>
            ) : (
              <div className="form-disabled-state">
                <p>Please select a reader profile on the left to add items to their wishlist.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
