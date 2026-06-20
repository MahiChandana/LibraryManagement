import api from '../api';

const reportService = {
  getReportData: async () => {
    const response = await api.get('/reports');
    return response.data;
  }
};

export default reportService;
