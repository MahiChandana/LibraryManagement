import api from '../api';

const authService = {
  login: async (email, password) => {
    // Send login request to the backend AuthController
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    
    if (userData && userData.token) {
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    }
    return userData;
  },

  register: async (name, email, password) => {
    // Send register request to the backend AuthController
    const response = await api.post('/auth/register', { name, email, password });
    const userData = response.data;
    
    if (userData && userData.token) {
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    }
    return userData;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;
