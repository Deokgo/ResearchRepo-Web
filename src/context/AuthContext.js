import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me", {
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
    try {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await fetchUserDetails();
    } catch (error) {
      console.error("Error during login:", error);
      localStorage.removeItem("token");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Keep one main interceptor for handling token refresh and 401 errors
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => {
        // Check if there's a new token in the response
        const newToken = response.data?.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [navigate]);

  // Set initial authorization header
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserDetails();
    } else {
      setLoading(false);
    }

    return () => {
      delete api.defaults.headers.common["Authorization"];
    };
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
