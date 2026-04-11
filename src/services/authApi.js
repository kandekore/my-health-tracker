import api from './api';

export const registerApi = (email, password, name) =>
  api.post('/auth/register', { email, password, name });

export const loginApi = (email, password) =>
  api.post('/auth/login', { email, password });
