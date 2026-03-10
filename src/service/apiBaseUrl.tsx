import axios from "axios";

const apiBaseUrl = axios.create({
  baseURL: "https://book-management-delta-five.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token dynamically
apiBaseUrl.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiBaseUrl;
