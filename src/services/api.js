import axios from "axios";

const api = axios.create({
  // Use your domain instead of IP
  baseURL: "https://app.mmcl-researchrepository.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Making request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

// Test the connection immediately
const testConnection = async () => {
  try {
    console.log("Testing API connection...");
    const response = await api.get("/");
    console.log("Connection successful:", response.status);
  } catch (error) {
    console.error("Connection test failed:", error.message);
  }
};

testConnection();

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Making request to:", config.url);
  return config;
});

export default api;
