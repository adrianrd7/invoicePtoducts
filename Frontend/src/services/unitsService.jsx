import api from './api';

const unitService = {

  getAll: async (params = {}) => {
    const response = await api.get('/units', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },

  create: async (unitData) => {
    const response = await api.post('/units', unitData);
    return response.data;
  },

  update: async (id, unitData) => {
    const response = await api.put(`/units/${id}`, unitData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/units/${id}`);
    return response.data;
  },

  
  getProductUnits: async (productId) => {
    const response = await api.get(`/units/product/${productId}`);
    return response.data;
  },

  configureProductUnits: async (productId, unitsConfig) => {
    const response = await api.post(`/units/product/${productId}/configure`, unitsConfig);
    return response.data;
  },

  getConversionTable: async (productId) => {
    const response = await api.get(`/units/product/${productId}/conversions`);
    return response.data;
  },


  convertProductUnits: async (productId, conversionData) => {
    const response = await api.post(`/units/product/${productId}/convert`, conversionData);
    return response.data;
  },

  convertGlobalUnits: async (conversionData) => {
    const response = await api.post('/units/convert', conversionData);
    return response.data;
  },
};

export default unitService;