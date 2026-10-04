import api from './api';

export const predictionApi = {
  getHistory: async (params = {}) => {
    const response = await api.get('/predictions/history', { params });
    return response.data;
  },

  getDetail: async (predictionId) => {
    const response = await api.get(`/predictions/${predictionId}`);
    return response.data;
  },
};
