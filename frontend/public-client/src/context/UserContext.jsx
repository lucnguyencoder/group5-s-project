import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import avatarService from "../services/avatarService";
import { toast } from "sonner";
import locationService from "../services/locationService";
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
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [isPickUp, setIsPickup] = useState(false);

  const togglePickup = () => {
    setIsPickup((prev) => !prev);
    return isPickUp;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const userFromCookies = authService.getUserFromCookies();
      if (!userFromCookies) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          if (
            currentUser?.group?.type !== "customer" &&
            currentUser?.group?.type !== null
          ) {
            setUser(null);
            setIsAuthenticated(false);
            authService.logout();
            toast.error(
              "Unauthorized Account. Please login with authorized account or contact to the system"
            );
          }
          if (currentUser.is_active !== null && !currentUser.is_active) {
            toast.error("Account is disabled");
            setAccountDisabled(true);
          } else {
            setUser(currentUser);
            setIsAuthenticated(true);
            setAccountDisabled(false);
          }

          if (currentUser.deliveryAddresses) {
            setDeliveryAddresses(currentUser.deliveryAddresses);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          authService.logout();
        }
      } catch (error) {
        console.log(error);
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
      if (response.success) {
        if (response.is_enabled_2fa) {
          return response;
        } else {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
      };
    }
  };
  const register = async (userData) => {
    const response = await authService.register(userData);

    return response;
  };
  const getCoord = async () => {
    for (const address of deliveryAddresses) {
      if (address.is_default) {
        return address;
      }
    }
    return null;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return {
        success: true,
        message: response.message || "OTP sent successfully",
        requestId: response.requestId,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to send password reset email",
      };
    }
  };

  const verifyOTP = async (id, otp) => {
    try {
      console.log(id);
      const response = await authService.verifyOTP(id, otp);
      return {
        success: true,
        message: response.message || "OTP is invalid",
        resetToken: response.resetToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to verify OTP",
      };
    }
  };

  const resetPassword = async (resetToken, password) => {
    try {
      const response = await authService.resetPassword(resetToken, password);
      return {
        success: true,
        message: response.message || "Success to reset Password",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to reset Password",
      };
    }
  };

  const verify2FA = async (tempToken, id, otp) => {
    try {
      const response = await authService.verify2FA(tempToken, id, otp);
      if (response.success) {
        const user = authService.getUserFromCookies();
        setUser(user);
        setIsAuthenticated(true);
        return {
          success: response.success,
          message: response.success,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to reset Password",
      };
    }
  };

  const toggle2Fa = async (userId) => {
    try {
      const response = await authService.toggle2Fa(userId);
      if (response.success) {
        const user = await authService.getCurrentUser();
        return {
          success: true,
          message: response.message,
          is_enabled_2fa: user.is_enabled_2fa,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to enable/disable",
      };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const response = await authService.changePassword({
        current_password,
        new_password,
      });

      if (response.success && response.data?.token) {
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to change password",
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
        }));
        return response;
      }
      throw new Error(response.message || "Failed to update profile");
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const addLocation = async (locationData) => {
    try {
      const response = await locationService.createLocation(locationData);
      if (response.success) {
        setDeliveryAddresses((prev) => [...prev, response.data]);
        if (response.data.is_default || deliveryAddresses.length === 0) {
          setUser((prevUser) => ({
            ...prevUser,
            deliveryAddresses: [
              ...(prevUser?.deliveryAddresses || []),
              response.data,
            ],
          }));
        }

        toast.success("Address added successfully");
        return response;
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to add address");
      return {
        success: false,
        message: error.message || "Failed to add address",
      };
    }
  };

  const updateLocation = async (locationId, locationData) => {
    try {
      const response = await locationService.updateLocation(
        locationId,
        locationData
      );
      if (response.success) {
        setDeliveryAddresses((prev) =>
          prev.map((loc) =>
            loc.address_id === locationId ? response.data : loc
          )
        );

        setUser((prevUser) => ({
          ...prevUser,
          deliveryAddresses:
            prevUser?.deliveryAddresses?.map((loc) =>
              loc.address_id === locationId ? response.data : loc
            ) || [],
        }));
        return response;
      }
      throw new Error(response.message || "Failed to update location");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deleteLocation = async (locationId) => {
    try {
      const response = await locationService.deleteLocation(locationId);
      if (response.success) {
        setDeliveryAddresses((prev) =>
          prev.filter((loc) => loc.address_id !== locationId)
        );

        setUser((prevUser) => ({
          ...prevUser,
          deliveryAddresses:
            prevUser?.deliveryAddresses?.filter(
              (loc) => loc.address_id !== locationId
            ) || [],
        }));

        return response;
      }
      throw new Error(response.message || "Failed to delete location");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const setDefaultLocation = async (locationId) => {
    try {
      const response = await locationService.setDefaultLocation(locationId);
      if (response.success) {
        setDeliveryAddresses((prev) =>
          prev.map((loc) => ({
            ...loc,
            is_default: loc.address_id === locationId,
          }))
        );

        setUser((prevUser) => ({
          ...prevUser,
          deliveryAddresses:
            prevUser?.deliveryAddresses?.map((loc) => ({
              ...loc,
              is_default: loc.address_id === locationId,
            })) || [],
        }));

        return response;
      }
      throw new Error(response.message || "Failed to set default location");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const response = await avatarService.uploadAvatar(file);
      if (response.success) {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: response.data.avatar_url,
        }));
        toast.success("Avatar uploaded successfully");
        return response;
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to upload avatar");
      return {
        success: false,
        message: error.message || "Failed to upload avatar",
      };
    }
  };

  const removeAvatar = async () => {
    try {
      const response = await avatarService.removeAvatar();
      if (response.success) {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: null,
        }));
        toast.success("Avatar removed successfully");
        return response;
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to remove avatar");
      return {
        success: false,
        message: error.message || "Failed to remove avatar",
      };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    accountDisabled,
    deliveryAddresses,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    verifyOTP,
    verify2FA,
    toggle2Fa,
    addLocation,
    updateLocation,
    deleteLocation,
    setDefaultLocation,
    uploadAvatar,
    removeAvatar,
    getCoord,
    isPickUp,
    setIsPickup,
    togglePickup,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
