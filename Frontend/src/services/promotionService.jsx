import api from './api';

const promotionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/promotions', { params });
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/promotions/active');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/promotions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/promotions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  }
};

export default promotionService;