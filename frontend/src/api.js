import axios from 'axios';

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach authorization tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error formatting
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "An error occurred while connecting to the server.";
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      errorMessage = error.response.data?.message || error.response.data || `Server error (${error.response.status})`;
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = "No response from server. Please check if your backend is running on port 8080.";
    } else {
      // Something else happened in setting up the request
      errorMessage = error.message;
    }
    
    // Create custom formatted error object
    const formattedError = {
      message: errorMessage,
      status: error.response?.status || null,
      data: error.response?.data || null,
      originalError: error
    };

    console.error("API Error details:", formattedError);
    return Promise.reject(formattedError);
  }
);

export default api;
