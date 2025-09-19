// necessary constants
// Use Vite's env. Fallback to production URL when MODE isn't available.
const MODE = import.meta.env?.MODE || "production";
export const API_BASE_URL =
  MODE === "development"
    ? "http://localhost:8800/api"
    : "https://raahi-server.onrender.com/api";

export const API_ENDPOINTS = {
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
  // data routes are mounted at /api/, not /api/data
  weather: "/weather",
  crowd: "/crowd",
  currency: "/currency",
  hotels: "/hotels",
  pois: "/pois",
  aiPlan: "/ai/plan",
};
