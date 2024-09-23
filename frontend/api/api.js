import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;
console.log(API_URL);
const customAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

customAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);
customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      console.error('Invalid or expired token. Token has been removed.');
    }
    return Promise.reject(error);
  },
);

export default customAxios;
