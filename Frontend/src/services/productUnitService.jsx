import api from './api';

const productUnitService = {
  getAll: async (params = {}) => {
    const response = await api.get('/product-units', { params });
    return response.data;
  },

  getByProduct: async (productId) => {
    const response = await api.get(`/product-units/product/${productId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/product-units/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/product-units', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/product-units/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/product-units/${id}`);
    return response.data;
  }
};

export default productUnitService;