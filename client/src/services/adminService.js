import api from './api';

export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  getReports: async (params = {}) => {
    const res = await api.get('/admin/reports', { params });
    return res.data;
  },

  resolveReport: async (id, data) => {
    const res = await api.put(`/admin/reports/${id}/resolve`, data);
    return res.data;
  },

  getUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  updateUserStatus: async (id, data) => {
    const res = await api.put(`/users/${id}/status`, data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export default adminService;
