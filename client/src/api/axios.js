import axios from "axios";

// Generic axios client that can be reused across the app
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://example.com/api",
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  // Attach auth token or other headers here
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize errors
    const message =
      error?.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default client;
