import api from './api';

export const createKeto = (data)     => api.post('/keto', data);
export const listKeto   = (params)   => api.get('/keto', { params });
export const updateKeto = (id, data) => api.patch(`/keto/${id}`, data);
export const deleteKeto = (id)       => api.delete(`/keto/${id}`);
