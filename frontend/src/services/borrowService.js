import api from '../api';

const borrowService = {
  borrowBook: async (userId, bookId) => {
    const response = await api.post('/borrow', { userId, bookId });
    return response.data;
  },

  getBorrowedBooks: async () => {
    const response = await api.get('/borrow');
    return response.data;
  },

  getBorrowedBooksByUser: async (userId) => {
    const response = await api.get(`/borrow/user/${userId}`);
    return response.data;
  },

  getBorrowedBooksByBook: async (bookId) => {
    const response = await api.get(`/borrow/book/${bookId}`);
    return response.data;
  },

  returnBook: async (borrowId) => {
    const response = await api.put(`/borrow/return/${borrowId}`);
    return response.data;
  }
};

export default borrowService;
