import api from './api';

export const heartApi = {
  predict: async (heartData) => {
    const response = await api.post('/heart/predict', heartData);
    return response.data;
  },
};
