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
        logout();
      }
    };

    // Check session every 30 seconds
    const intervalId = setInterval(validateSession, 30000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
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
