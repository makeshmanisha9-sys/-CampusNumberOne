import api from './api';

export const postService = {
  getPosts: async (params = {}) => {
    const res = await api.get('/posts', { params });
    return res.data;
  },

  createPost: async (data) => {
    const res = await api.post('/posts', data);
    return res.data;
  },

  deletePost: async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  toggleLikePost: async (id) => {
    const res = await api.post(`/posts/${id}/like`);
    return res.data;
  },

  getComments: async (id) => {
    const res = await api.get(`/posts/${id}/comments`);
    return res.data;
  },

  addComment: async (id, data) => {
    const res = await api.post(`/posts/${id}/comment`, data);
    return res.data;
  },

  deleteComment: async (commentId) => {
    const res = await api.delete(`/posts/comments/${commentId}`);
    return res.data;
  },

  reportPost: async (id, data) => {
    const res = await api.post(`/posts/${id}/report`, data);
    return res.data;
  },
};

export default postService;
