import api from '../api';

const dashboardService = {
  getDashboardStats: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getUserDashboardStats: async (userId) => {
    const response = await api.get(`/dashboard/user/${userId}`);
    return response.data;
  }
};

export default dashboardService;
