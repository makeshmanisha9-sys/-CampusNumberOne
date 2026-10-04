import api from './api';

export const academicService = {
  getMaterials: async (params = {}) => {
    const res = await api.get('/academics/materials', { params });
    return res.data;
  },

  uploadMaterial: async (data) => {
    const res = await api.post('/academics/materials', data);
    return res.data;
  },

  deleteMaterial: async (id) => {
    const res = await api.delete(`/academics/materials/${id}`);
    return res.data;
  },

  getAssignments: async (params = {}) => {
    const res = await api.get('/academics/assignments', { params });
    return res.data;
  },

  getAssignmentById: async (id) => {
    const res = await api.get(`/academics/assignments/${id}`);
    return res.data;
  },

  createAssignment: async (data) => {
    const res = await api.post('/academics/assignments', data);
    return res.data;
  },

  submitAssignment: async (id, data) => {
    const res = await api.post(`/academics/assignments/${id}/submit`, data);
    return res.data;
  },

  gradeSubmission: async (submissionId, data) => {
    const res = await api.post(`/academics/submissions/${submissionId}/grade`, data);
    return res.data;
  },

  getStudentOverview: async () => {
    const res = await api.get('/academics/overview');
    return res.data;
  },
};

export default academicService;
