import api from '../api';

const wishlistService = {
  addToWishlist: async (userId, bookId) => {
    const response = await api.post('/wishlist', { userId, bookId });
    return response.data;
  },

  getWishlistByUser: async (userId) => {
    const response = await api.get(`/wishlist/user/${userId}`);
    return response.data;
  },

  removeFromWishlist: async (wishlistId) => {
    const response = await api.delete(`/wishlist/${wishlistId}`);
    return response.data;
  },

  borrowFromWishlist: async (wishlistId) => {
    const response = await api.post(`/wishlist/borrow/${wishlistId}`);
    return response.data;
  }
};

export default wishlistService;
