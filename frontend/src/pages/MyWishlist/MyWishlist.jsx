import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import wishlistService from '../../services/wishlistService';
import borrowService from '../../services/borrowService';
import Loader from '../../components/Loader/Loader';
import './MyWishlist.css';

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [borrowedBookIds, setBorrowedBookIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const currentUser = authService.getCurrentUser();
  const userId = currentUser ? currentUser.id : null;

  const fetchWishlist = async () => {
    if (!userId) {
      setError("User session not found.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [wishlistData, borrowsData] = await Promise.all([
        wishlistService.getWishlistByUser(userId),
        borrowService.getBorrowedBooksByUser(userId)
      ]);
      setWishlist(wishlistData);
      
      const activeBorrowedIds = borrowsData
        .filter(b => b.status === 'BORROWED' || !b.returnDate)
        .map(b => b.bookId);
      setBorrowedBookIds(activeBorrowedIds);
    } catch (err) {
      console.error("Error loading user wishlist", err);
      setError("Failed to retrieve your wishlist catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const handleRemove = async (wishlistId) => {
    try {
      setActionLoading(true);
      setError(null);
      await wishlistService.removeFromWishlist(wishlistId);
      showTemporaryMessage("Removed from your wishlist!");
      await fetchWishlist();
    } catch (err) {
      console.error("Failed to remove item", err);
      setError(err.message || "Failed to remove book from wishlist.");
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
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="my-wishlist-page">
      <div className="page-header">
        <h1 className="page-title">My Wishlist</h1>
        <button className="btn btn-secondary refresh-btn" onClick={fetchWishlist}>
          🔄 Refresh List
        </button>
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
        <Loader message="Loading your reading wishlist..." />
      ) : wishlist.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-state-icon">💖</span>
          <h3>Your Wishlist is Empty</h3>
          <p>You have not saved any books to read later yet. Browse catalogs to discover books!</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Date Saved</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item) => {
                  const isAvailable = item.bookAvailable;
                  const isCurrentlyBorrowed = borrowedBookIds.includes(item.bookId);
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.bookTitle || 'Unknown Book'}</strong>
                      </td>
                      <td>{item.bookAuthor || 'Unknown Author'}</td>
                      <td>{formatDate(item.addedDate)}</td>
                      <td>
                        {isCurrentlyBorrowed ? (
                          <span className="badge badge-warning">BORROWED</span>
                        ) : (
                          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                            {isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
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
  );
};

export default MyWishlist;
