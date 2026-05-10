import axios from "axios";
import { API_TIMEOUT_MS } from "../utils/constants";
import { clearToken, getToken } from "../utils/token";

const baseURL = import.meta.env.VITE_URL_API
  ? `${import.meta.env.VITE_URL_API}/api`
  : "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
