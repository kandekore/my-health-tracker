import api from './api';

export const createSeizure = (data) => api.post('/seizures', data);
export const listSeizures  = (params) => api.get('/seizures', { params });
export const updateSeizure = (id, data) => api.patch(`/seizures/${id}`, data);
