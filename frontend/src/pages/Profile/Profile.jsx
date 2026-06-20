import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import userService from '../../services/userService';
import Loader from '../../components/Loader/Loader';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = authService.getCurrentUser();
  const userId = currentUser ? currentUser.id : null;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError("User session not found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await userService.getUserById(userId);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Unable to retrieve profile information from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <Loader message="Loading your reader profile details..." />;
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="alert alert-danger">
          <span>⚠️ {error || "Profile could not be loaded."}</span>
        </div>
      </div>
    );
  }

  // Format creation date
  const formatMemberDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      <div className="profile-card card">
        <div className="profile-header-banner">
          <div className="profile-avatar-large">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-title-block">
            <h2>{profile.name}</h2>
            <span className="profile-role-tag">Library Member</span>
          </div>
        </div>

        <div className="profile-details-list">
          <div className="profile-detail-row">
            <div className="detail-label">
              <span>📧 Email Address</span>
            </div>
            <div className="detail-value">
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="profile-detail-row">
            <div className="detail-label">
              <span>📞 Contact Number</span>
            </div>
            <div className="detail-value">
              <span>{profile.phone}</span>
            </div>
          </div>

          <div className="profile-detail-row">
            <div className="detail-label">
              <span>🏠 Residential Address</span>
            </div>
            <div className="detail-value">
              <span>{profile.address || 'No address provided'}</span>
            </div>
          </div>

          <div className="profile-detail-row">
            <div className="detail-label">
              <span>📅 Member Since</span>
            </div>
            <div className="detail-value">
              <span>{formatMemberDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="profile-card-footer">
          <p>LibFlow Library Card ID: <code>LF-{String(profile.id).padStart(5, '0')}</code></p>
          <span className="badge badge-success">Active Account</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
