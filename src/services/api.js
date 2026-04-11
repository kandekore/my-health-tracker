import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

if (__DEV__) console.log('[api] baseURL =', baseURL);

const api = axios.create({
  baseURL,
  timeout: 10_000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ECONNABORTED') {
      err.message = `Request timed out. Is the API reachable at ${baseURL}?`;
    } else if (err.message === 'Network Error') {
      err.message = `Can't reach the server at ${baseURL}. Check your LAN IP and that the backend is running.`;
    } else if (err.response?.data?.error) {
      err.message = err.response.data.error;
    }
    if (__DEV__) console.log('[api] error:', err.message);
    return Promise.reject(err);
  },
);

export default api;
