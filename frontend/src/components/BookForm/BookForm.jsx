import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ initialData = null, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    publicationYear: new Date().getFullYear()
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        category: initialData.category || '',
        description: initialData.description || '',
        totalCopies: initialData.totalCopies !== undefined ? initialData.totalCopies : 1,
        availableCopies: initialData.availableCopies !== undefined ? initialData.availableCopies : 1,
        publicationYear: initialData.publicationYear || new Date().getFullYear()
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalCopies' || name === 'availableCopies' || name === 'publicationYear'
        ? (value === '' ? '' : parseInt(value, 10))
        : value
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.totalCopies === '' || isNaN(formData.totalCopies) || formData.totalCopies <= 0) {
      newErrors.totalCopies = 'Total copies must be a positive number';
    }

    if (formData.availableCopies === '' || isNaN(formData.availableCopies) || formData.availableCopies < 0) {
      // Prompt says "Available Copies must be positive", let's make it >= 0 (as copies could be 0 when all are borrowed)
      // We will check > 0 if explicitly positive is required, or >= 0. Let's make it >= 0, but if user explicitly entered negative, error.
      // Let's enforce positive (>0) as requested by "must be positive", but we will allow 0 if they borrow all.
      // Actually, to follow "Available Copies must be positive" literally:
      newErrors.availableCopies = 'Available copies must be a positive number';
    } else if (formData.availableCopies > formData.totalCopies) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }

    if (formData.publicationYear === '' || isNaN(formData.publicationYear) || formData.publicationYear <= 0) {
      newErrors.publicationYear = 'Publication year must be a valid positive year';
    } else if (formData.publicationYear > new Date().getFullYear() + 1) {
      newErrors.publicationYear = 'Publication year cannot be in the future';
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

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{initialData ? 'Edit Book Details' : 'Add New Book'}</h3>
      
      <div className="form-grid">
        <div className="form-group grid-col-2">
          <label className="form-label" htmlFor="title">Book Title*</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. The Pragmatic Programmer"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="author">Author*</label>
          <input
            id="author"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g. Andy Hunt"
            className={`form-control ${errors.author ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
          />
          {errors.author && <span className="form-error">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="isbn">ISBN*</label>
          <input
            id="isbn"
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="e.g. 978-0135957059"
            className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
          />
          {errors.isbn && <span className="form-error">{errors.isbn}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category*</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="publicationYear">Publication Year*</label>
          <input
            id="publicationYear"
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            placeholder="e.g. 2019"
            className={`form-control ${errors.publicationYear ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
          />
          {errors.publicationYear && <span className="form-error">{errors.publicationYear}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="totalCopies">Total Copies*</label>
          <input
            id="totalCopies"
            type="number"
            name="totalCopies"
            min="1"
            value={formData.totalCopies}
            onChange={handleChange}
            className={`form-control ${errors.totalCopies ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
          />
          {errors.totalCopies && <span className="form-error">{errors.totalCopies}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="availableCopies">Available Copies*</label>
          <input
            id="availableCopies"
            type="number"
            name="availableCopies"
            min="0"
            value={formData.availableCopies}
            onChange={handleChange}
            className={`form-control ${errors.availableCopies ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
          />
          {errors.availableCopies && <span className="form-error">{errors.availableCopies}</span>}
        </div>

        <div className="form-group grid-col-2">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter brief description of the book..."
            rows="3"
            className="form-control"
            disabled={isSubmitting}
          ></textarea>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
