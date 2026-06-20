import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ initialData = null, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Basic phone check (allow digits, spaces, hyphens, plus)
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      // If we just check for standard length, or stick to simple non-empty to be safe
      // Let's do simple length check or regex, let's keep phone validation simple since formats vary
      if (formData.phone.trim().length < 8) {
        newErrors.phone = 'Please enter a valid phone number (min 8 digits)';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{initialData ? 'Edit User Details' : 'Add New User'}</h3>

      <div className="form-group">
        <label className="form-label" htmlFor="name">Full Name*</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          disabled={isSubmitting}
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email Address*</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. john.doe@example.com"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          disabled={isSubmitting}
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="phone">Phone Number*</label>
        <input
          id="phone"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. +1 555-0199"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          disabled={isSubmitting}
        />
        {errors.phone && <span className="form-error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="address">Address*</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g. 123 Main St, New York, NY 10001"
          rows="3"
          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          disabled={isSubmitting}
        ></textarea>
        {errors.address && <span className="form-error">{errors.address}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
