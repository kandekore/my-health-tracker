import axios from 'axios';
export default axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api', // 10.0.2.2 = Android-emu, use LAN IP for devices
});
