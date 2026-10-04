import api from './api';

export const medicalApi = {
  predict: async (symptomsData) => {
    const response = await api.post('/medical/predict', symptomsData);
    return response.data;
  },
};
