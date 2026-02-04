import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "sonner";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountDisabled, setAccountDisabled] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      const userFromCookies = authService.getUserFromCookies();

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (!userFromCookies) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        // console.log("Current user:", currentUser);
        if (currentUser) {
          if (currentUser?.group?.type !== "system") {
            setUser(null);
            setIsAuthenticated(false);
            // authService.logout();
            toast.error(
              "Please login with authorized account or contact to the system"
            );
          }
          if (currentUser.is_active !== null && !currentUser.is_active) {
            toast.error("Account is disabled");
            setAccountDisabled(true);
          } else {
            setUser(currentUser);
            setIsAuthenticated(true);
            setAccountDisabled(false);
            setPermissions(currentUser.permissions || []);
          }
        } else {
          toast.error("Failed to fetch user data. Please login again.");
          setUser(null);
          setIsAuthenticated(false);
          // authService.logout();
        }
      } catch (error) {
        console.error(error);
        setUser(null);
        setIsAuthenticated(false);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      // console.log("Login response:", response);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const changePassword = async (userId, currentPassword, newPassword) => {
    try {
      const response = await authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );
      if (response.success) {
        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: "Change password failed.",
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser((prevUser) => ({
          ...prevUser,
          profile: response.data.customerProfile,
          profile_picture: response.data.profile_picture,
        }));
        return response;
      }
      throw new Error(response.message || "Failed to update profile");
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    changePassword,
    updateProfile,
    setUser,
    accountDisabled,
    permissions,

  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
