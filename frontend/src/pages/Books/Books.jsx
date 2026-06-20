import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import bookService from '../../services/bookService';
import wishlistService from '../../services/wishlistService';
import authService from '../../services/authService';
import BookForm from '../../components/BookForm/BookForm';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader/Loader';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const user = authService.getCurrentUser();
  const role = user ? user.role : 'USER';
  const currentUserId = user ? user.id : null;
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Sorting State
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Detailed View Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState(null);

  const location = useLocation();

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science & Technology',
    'History & Biography',
    'Self-Help & Business',
    'Poetry & Drama',
    'Mystery & Thriller',
    'Fantasy & Sci-Fi'
  ];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = [];
      if (selectedCategory) {
        data = await bookService.getBooksByCategory(selectedCategory);
      } else if (searchKeyword.trim()) {
        data = await bookService.searchBooks(searchKeyword.trim());
      } else {
        data = await bookService.getAllBooks();
      }
      setBooks(data);
    } catch (err) {
      console.error("Error loading books", err);
      setError(err.message || "Failed to load books from server.");
    } finally {
      setLoading(false);
    }
  };

  // Listen to URL search queries (like ?filter=available)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('filter') === 'available') {
      setShowOnlyAvailable(true);
    } else {
      setShowOnlyAvailable(false);
    }
    fetchBooks();
  }, [location.search, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCategory(''); // Clear category when performing search
    fetchBooks();
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    setShowOnlyAvailable(false);
    fetchBooks();
  };

  // Add & Edit actions
  const openAddModal = () => {
    setEditingBook(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (book, e) => {
    e.stopPropagation();
    setEditingBook(book);
    setIsFormModalOpen(true);
  };

  const openViewModal = (book) => {
    setViewingBook(book);
    setIsViewModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setActionLoading(true);
      setError(null);
      if (editingBook) {
        await bookService.updateBook(editingBook.id, formData);
        showTemporaryMessage("Book details updated successfully!");
      } else {
        await bookService.createBook(formData);
        showTemporaryMessage("New book added successfully!");
      }
      setIsFormModalOpen(false);
      fetchBooks();
    } catch (err) {
      setError(err.message || "An error occurred while saving the book.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Actions
  const openDeleteModal = (book, e) => {
    e.stopPropagation();
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    try {
      setActionLoading(true);
      setError(null);
      await bookService.deleteBook(bookToDelete.id);
      showTemporaryMessage(`Book "${bookToDelete.title}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
      fetchBooks();
    } catch (err) {
      setError(err.message || "Could not delete book. It might be currently borrowed.");
      setIsDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Wishlist Actions
  const handleWishlistAction = async (book, e) => {
    e.stopPropagation();
    if (role !== 'USER') return;
    try {
      setActionLoading(true);
      setError(null);
      await wishlistService.addToWishlist(currentUserId, book.id);
      showTemporaryMessage(`Added "${book.title}" to your wishlist!`);
    } catch (err) {
      console.error("Failed to add to wishlist", err);
      setError(err.message || "Failed to add book to wishlist.");
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

  // Filter and Sort implementation in React
  let processedBooks = [...books];

  if (showOnlyAvailable) {
    processedBooks = processedBooks.filter(book => book.availableCopies > 0);
  }

  // Sort Books
  processedBooks.sort((a, b) => {
    let fieldA = a[sortBy];
    let fieldB = b[sortBy];

    if (fieldA == null) return sortOrder === 'asc' ? 1 : -1;
    if (fieldB == null) return sortOrder === 'asc' ? -1 : 1;

    if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
    if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="books-page">
      <div className="page-header">
        <h1 className="page-title">{role === 'LIBRARIAN' ? 'Manage Books Catalog' : 'Library Books Catalog'}</h1>
        {role === 'LIBRARIAN' && (
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ Add New Book
          </button>
        )}
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

      {/* Filters & Sorting Toolbar */}
      <div className="filters-bar card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="form-control filter-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control filter-select"
          >
            <option value="">-- All Categories --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="sort-filter">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control filter-select"
            title="Sort By"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="category">Sort by Category</option>
            <option value="availableCopies">Sort by Availability</option>
            <option value="publicationYear">Sort by Pub. Year</option>
          </select>
          <button 
            type="button" 
            className="btn btn-secondary sort-order-btn" 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title="Toggle sort direction"
          >
            {sortOrder === 'asc' ? '🔼' : '🔽'}
          </button>
        </div>

        {/* Checkbox for Available books only */}
        <div className="checkbox-filter">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={showOnlyAvailable} 
              onChange={(e) => setShowOnlyAvailable(e.target.checked)} 
            />
            Show In Stock Only
          </label>
        </div>

        <button className="btn btn-secondary" onClick={handleResetFilters}>
          Clear Filters
        </button>
      </div>

      {/* Main Grid / Loading State */}
      {loading ? (
        <Loader message="Loading books library inventory..." />
      ) : processedBooks.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-state-icon">📚</span>
          <h3>No Books Found</h3>
          <p>No books fit the current search criteria or category filter. Try clearing filters or adding a new book.</p>
          <button className="btn btn-primary" onClick={handleResetFilters}>Show All Books</button>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Pub. Year</th>
                  <th>Total Copies</th>
                  <th>Available Copies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <tr key={book.id} className="book-row clickable" onClick={() => openViewModal(book)}>
                      <td className="book-title-cell">
                        <span className="book-bold-title">{book.title}</span>
                        {book.description && <span className="book-desc-sub">{book.description.substring(0, 50)}...</span>}
                      </td>
                      <td>{book.author}</td>
                      <td><code>{book.isbn}</code></td>
                      <td><span className="badge badge-info">{book.category}</span></td>
                      <td>{book.publicationYear}</td>
                      <td>{book.totalCopies}</td>
                      <td>{book.availableCopies}</td>
                      <td>
                        <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                          {isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon" 
                            title="View details"
                            onClick={(e) => { e.stopPropagation(); openViewModal(book); }}
                          >
                            👁️
                          </button>
                          {role === 'LIBRARIAN' && (
                            <>
                              <button 
                                className="btn-icon" 
                                title="Edit details"
                                onClick={(e) => openEditModal(book, e)}
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon btn-icon-danger" 
                                title="Delete book"
                                onClick={(e) => openDeleteModal(book, e)}
                              >
                                🗑️
                              </button>
                            </>
                          )}
                          {role === 'USER' && (
                            <button 
                              className="btn-icon" 
                              title="Add to my wishlist"
                              onClick={(e) => handleWishlistAction(book, e)}
                            >
                              💖
                            </button>
                          )}
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

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingBook ? 'Edit Book Record' : 'Register New Book'}
        isSubmitting={actionLoading}
      >
        <BookForm
          initialData={editingBook}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isSubmitting={actionLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Book Record"
        isActionModal={true}
        confirmText="Delete Book"
        confirmBtnStyle="btn-danger"
        onConfirm={handleDeleteConfirm}
        isSubmitting={actionLoading}
      >
        <p className="delete-modal-text">
          Are you sure you want to delete the book <strong>"{bookToDelete?.title}"</strong> by {bookToDelete?.author}?
        </p>
        <p className="delete-modal-warning">
          ⚠️ This action is permanent. If this book has borrowing transactions, deletion may fail.
        </p>
      </Modal>



      {/* Detailed View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Book Details Overview"
        isActionModal={false}
      >
        {viewingBook && (
          <div className="book-details-view">
            <div className="details-header">
              <span className="details-emoji">📖</span>
              <div>
                <h2>{viewingBook.title}</h2>
                <p className="details-author">by {viewingBook.author}</p>
              </div>
            </div>
            <hr className="details-divider"/>
            <div className="details-grid">
              <div className="details-item">
                <strong>ISBN:</strong>
                <span><code>{viewingBook.isbn}</code></span>
              </div>
              <div className="details-item">
                <strong>Category / Genre:</strong>
                <span className="badge badge-info">{viewingBook.category}</span>
              </div>
              <div className="details-item">
                <strong>Publication Year:</strong>
                <span>{viewingBook.publicationYear || 'N/A'}</span>
              </div>
              <div className="details-item">
                <strong>Total Copies:</strong>
                <span>{viewingBook.totalCopies}</span>
              </div>
              <div className="details-item">
                <strong>Available Copies:</strong>
                <span>{viewingBook.availableCopies}</span>
              </div>
              <div className="details-item">
                <strong>Status:</strong>
                <span className={`badge ${viewingBook.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                  {viewingBook.availableCopies > 0 ? 'AVAILABLE' : 'NOT AVAILABLE'}
                </span>
              </div>
            </div>
            <div className="details-description">
              <strong>Description / Summary:</strong>
              <p>{viewingBook.description || 'No summary provided for this book.'}</p>
            </div>
            <div className="details-actions">
              <button className="btn btn-secondary w-100" onClick={() => setIsViewModalOpen(false)}>
                Close Panel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Books;
