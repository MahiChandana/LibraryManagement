import api from '../api';

const bookService = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  searchBooks: async (keyword) => {
    const response = await api.get(`/books/search`, {
      params: { keyword }
    });
    return response.data;
  },

  getBooksByCategory: async (category) => {
    const response = await api.get(`/books/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  }
};

export default bookService;
