import axios from 'axios';

// Production API base URL from environment variable
// For Vercel: API calls will be on the same domain (/api/*)
// For local development: use localhost with port
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

console.log('API Base URL:', apiBaseURL);

const instance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for logging (development only)
if (import.meta.env.DEV) {
  instance.interceptors.request.use(
    config => {
      console.log('API Request:', config.url);
      return config;
    },
    error => Promise.reject(error)
  );
}

export default instance;
