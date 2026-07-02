import axios from 'axios';

// Production API base URL from environment variable
// Falls back to localhost for development
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL}';

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
