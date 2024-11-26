import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set up periodic validation check
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await axios.get("/auth/validate-session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Only logout if refresh token also fails
        try {
          await refreshToken();
        } catch (refreshError) {
          logout();
        }
      }
    };

    validateSession(); // Run immediately
    const intervalId = setInterval(validateSession, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [navigate]);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const response = await axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchUserDetails();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("/auth/refresh");
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        return token;
      }
      throw new Error("No token received");
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      throw error;
    }
  };

  // Keep one main interceptor for handling token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshToken();
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, fetchUserDetails }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
