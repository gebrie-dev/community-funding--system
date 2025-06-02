// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUserFromData = (userData) => {
    setCurrentUser({
      id: userData.id || null,
      email: userData.email || "",
      name: userData.first_name || userData.email || "",
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      is_staff: userData.is_staff || false,
    });
  };

  // Load user profile on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get(API_ENDPOINTS.PROFILE)
      .then((userData) => setUserFromData(userData))
      .catch((error) => {
        console.error("Error loading profile:", error);
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_email");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });

      if (!response.tokens?.access) {
        throw new Error("Invalid server response: Missing access token");
      }

      localStorage.setItem("user_id", response.user.id);
      localStorage.setItem("user_email", response.user.email);
      localStorage.setItem("token", response.tokens.access);
      if (response.tokens.refresh) {
        localStorage.setItem("refreshToken", response.tokens.refresh);
      }

      const userData = response.user || { email };
      setUserFromData(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const signup = async (formData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, formData);

      if (!response.tokens?.access) {
        throw new Error("Invalid server response: Missing access token");
      }

      localStorage.setItem("token", response.tokens.access);
      if (response.tokens.refresh) {
        localStorage.setItem("refreshToken", response.tokens.refresh);
      }

      const userData = response.user || { email: formData.email };
      setUserFromData(userData);
      return userData;
    } catch (error) {
      console.error("Signup failed:", error.message);
      throw new Error(error.message || "Failed to register user");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error.message);
      throw new Error(error.message || "Failed to logout");
    }
  };

  const resetPassword = async (email) => {
    try {
      await api.post(API_ENDPOINTS.PASSWORD_RESET, { email });
    } catch (error) {
      console.error("Password reset failed:", error.message);
      throw new Error(error.message || "Failed to reset password");
    }
  };

  const isAdmin = () => currentUser?.is_staff || false;

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
