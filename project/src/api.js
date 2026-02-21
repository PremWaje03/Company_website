import axios from "axios";

const TOKEN_KEY = "adminToken";

export const API_BASE_URL =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    if (status === 401 && url.includes("/api/admin/")) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent("admin-auth-expired"));
    }

    return Promise.reject(error);
  }
);

export const toAbsoluteMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return url;
};

export const saveAdminToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const hasAdminToken = () => {
  return Boolean(localStorage.getItem(TOKEN_KEY));
};

export default api;
