import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import bookService from '../../services/bookService';
import borrowService from '../../services/borrowService';
import UserForm from '../../components/UserForm/UserForm';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader/Loader';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Direct Book Issuance states
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueUser, setIssueUser] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [issueError, setIssueError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
      setError(err.message || "Failed to load users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Form submit (Add & Edit)
  const openAddModal = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setActionLoading(true);
      setError(null);
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
        showTemporaryMessage("User profile updated successfully!");
      } else {
        await userService.createUser(formData);
        showTemporaryMessage("New user registered successfully!");
      }
      setIsFormModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || "An error occurred while saving the user profile.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete flow
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      setError(null);
      await userService.deleteUser(userToDelete.id);
      showTemporaryMessage(`Member profile "${userToDelete.name}" deleted!`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Could not delete user. This reader might have active borrow logs.");
      setIsDeleteModalOpen(false);
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

  // Direct Book Issuance actions
  const openIssueModal = async (user) => {
    setIssueUser(user);
    setSelectedBookId('');
    setIssueError('');
    try {
      setActionLoading(true);
      const allBooks = await bookService.getAllBooks();
      const available = allBooks.filter(b => b.availableCopies > 0);
      setAvailableBooks(available);
      setIsIssueModalOpen(true);
    } catch (err) {
      console.error("Failed to load available books", err);
      setError("Failed to load available books catalog.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssueSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIssueError('');
    if (!selectedBookId) {
      setIssueError('Please select a book to issue.');
      return;
    }
    try {
      setActionLoading(true);
      await borrowService.borrowBook(issueUser.id, selectedBookId);
      showTemporaryMessage(`Book issued successfully to ${issueUser.name}!`);
      setIsIssueModalOpen(false);
      setIssueUser(null);
      setSelectedBookId('');
    } catch (err) {
      console.error("Issue book failed", err);
      setIssueError(err.message || "Failed to issue the book. Verify availability.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Manage Registered Users</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          ➕ Register New User
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
        <Loader message="Loading library subscribers directory..." />
      ) : users.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-state-icon">👥</span>
          <h3>No Users Found</h3>
          <p>There are no library members currently registered. Get started by adding a user.</p>
          <button className="btn btn-primary" onClick={openAddModal}>Register First User</button>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Reader Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Residential Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="user-name-cell">
                      <div className="avatar-circle">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="user-bold-name">{user.name}</span>
                    </td>
                    <td><a href={`mailto:${user.email}`} className="user-email-link">{user.email}</a></td>
                    <td>{user.phone}</td>
                    <td className="user-address-cell">{user.address}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon" 
                          title="Issue Book"
                          onClick={() => openIssueModal(user)}
                        >
                          🔄
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Edit profile"
                          onClick={() => openEditModal(user)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon btn-icon-danger" 
                          title="Delete profile"
                          onClick={() => openDeleteModal(user)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingUser ? 'Edit Subscriber Profile' : 'Register New Subscriber'}
        isSubmitting={actionLoading}
      >
        <UserForm
          initialData={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isSubmitting={actionLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Subscriber Profile"
        isActionModal={true}
        confirmText="Delete User"
        confirmBtnStyle="btn-danger"
        onConfirm={handleDeleteConfirm}
        isSubmitting={actionLoading}
      >
        <p className="delete-modal-text">
          Are you sure you want to delete the user profile for <strong>"{userToDelete?.name}"</strong> ({userToDelete?.email})?
        </p>
        <p className="delete-modal-warning">
          ⚠️ This action is permanent. If this user currently has borrowed books or has a wishlist, deletion may fail.
        </p>
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title={`Issue Book to ${issueUser?.name || 'Subscriber'}`}
        isActionModal={true}
        confirmText="Issue Book"
        confirmBtnStyle="btn-primary"
        onConfirm={handleIssueSubmit}
        isSubmitting={actionLoading}
      >
        <form onSubmit={handleIssueSubmit} className="direct-issue-form" style={{ marginTop: '0.5rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Select the book you wish to issue to <strong>{issueUser?.name}</strong> ({issueUser?.email}):
          </p>
          
          <div className="form-group">
            <label className="form-label" htmlFor="issueBookSelect">Select Book*</label>
            <select
              id="issueBookSelect"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="form-control"
              disabled={actionLoading}
            >
              <option value="">-- Choose Book --</option>
              {availableBooks.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} by {b.author} ({b.availableCopies} available)
                </option>
              ))}
            </select>
            {availableBooks.length === 0 && (
              <span className="form-error">No books are currently available in the catalog.</span>
            )}
          </div>

          {issueError && <span className="form-error form-group-error">{issueError}</span>}
        </form>
      </Modal>
    </div>
  );
};

export default Users;
