import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // optional (for cookies if needed)
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("yt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("yt_token");
      localStorage.removeItem("yt_user");
    }

    return Promise.reject(error);
  }
);

export default API;