import api from './api';

export const chatApi = {
  sendMessage: async (message, history = []) => {
    const response = await api.post('/chat/assistant', { message, history });
    return response.data;
  },
};
