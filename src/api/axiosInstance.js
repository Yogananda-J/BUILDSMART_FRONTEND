import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/', 
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  let token = localStorage.getItem('token');
  
  if (token && (token.startsWith('"') && token.endsWith('"'))) {
    token = token.slice(1, -1);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      // Log more info for debugging
      console.log(`[Auth] Token Found. Starts with: ${token.substring(0, 15)}... Length: ${token.length}`);
    }
  } else {
    if (import.meta.env.DEV) console.warn(`[API Request] ${config.url} - NO TOKEN FOUND`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${err.config?.method?.toUpperCase()} ${err.config?.url}`, {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
