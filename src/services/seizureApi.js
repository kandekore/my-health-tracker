// src/services/api.js should already exist; this just re-uses it
import api from './api';

/** POST /api/seizures */
export const createSeizure = (payload) =>
  api.post('/seizures', payload);

/** GET /api/seizures?… */
export const listSeizures = (params = {}) =>
  api.get('/seizures', { params });

/** PATCH /api/seizures/:id */
export const updateSeizure = (id, updates) =>
  api.patch(`/seizures/${id}`, updates);
