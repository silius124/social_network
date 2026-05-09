import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = localStorage.getItem("auth-storage");
  if (authStore) {
    const { state } = JSON.parse(authStore);
    const token = state.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);
