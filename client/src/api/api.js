import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants.js";

// Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header if token stored
API.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("raahi.token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore storage errors
  }
  return config;
});

// API helpers
export const signup = (inputs) => API.post(`${API_ENDPOINTS.signup}`, inputs);
export const login = (inputs) => API.post(`${API_ENDPOINTS.login}`, inputs);
export const logout = () => API.get(`${API_ENDPOINTS.logout}`);
export const currentUser = () => API.get(`${API_ENDPOINTS.me}`);
export const updateMe = (payload) => API.put(`/auth/update`, payload);

// Data fetching helpers
export const getWeather = () => API.get(API_ENDPOINTS.weather);
export const getCrowd = () => API.get(API_ENDPOINTS.crowd);
export const getCurrency = () => API.get(API_ENDPOINTS.currency);
export const getHotels = (params) => {
  const p = typeof params === "string" ? { location: params } : params || {};
  const qs = new URLSearchParams(p).toString();
  return API.get(`${API_ENDPOINTS.hotels}${qs ? `?${qs}` : ""}`);
};
export const getHotel = (id) => API.get(`${API_ENDPOINTS.hotels}/${id}`);
export const getPOIs = (city) => API.get(`${API_ENDPOINTS.pois}/${city}`);
export const postAIPlan = (payload) => API.post(API_ENDPOINTS.aiPlan, payload);
