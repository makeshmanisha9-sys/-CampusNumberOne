import api from './api';

export const achievementService = {
  getAchievements: async (params = {}) => {
    const res = await api.get('/achievements', { params });
    return res.data;
  },

  getMyAchievements: async () => {
    const res = await api.get('/achievements/my');
    return res.data;
  },

  createAchievement: async (data) => {
    const res = await api.post('/achievements', data);
    return res.data;
  },

  updateAchievement: async (id, data) => {
    const res = await api.put(`/achievements/${id}`, data);
    return res.data;
  },

  deleteAchievement: async (id) => {
    const res = await api.delete(`/achievements/${id}`);
    return res.data;
  },

  toggleLikeAchievement: async (id) => {
    const res = await api.post(`/achievements/${id}/like`);
    return res.data;
  },
};

export default achievementService;
