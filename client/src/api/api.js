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

// API helpers
export const signup = (inputs) => API.post(`${API_ENDPOINTS.signup}`, inputs);
export const login = (inputs) => API.post(`${API_ENDPOINTS.login}`, inputs);
export const logout = () => API.get(`${API_ENDPOINTS.logout}`);
export const currentUser = () => API.get(`${API_ENDPOINTS.me}`);
