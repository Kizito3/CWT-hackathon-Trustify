import axios from "axios";

// In development, Vite proxy handles /api requests
// In production, use the full API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register" &&
        !window.location.pathname.startsWith("/monitor/")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default client;
