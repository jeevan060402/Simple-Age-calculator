// src/services/api.js
import axios from 'axios';

// Create an axios instance with a base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080', // Use .env or fallback to localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
