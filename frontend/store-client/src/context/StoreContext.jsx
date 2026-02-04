import React, { createContext, useContext, useState, useEffect } from "react";
import { storeService } from "../services/basicService";
import { useUser } from "./UserContext";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: userLoading } = useUser();

  const fetchStore = async () => {
    if (!isAuthenticated) {
      setStore(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const storeData = await storeService.getCurrentStore();
      setStore(storeData);
    } catch (error) {
      console.error("Error fetching store:", error);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      fetchStore();
    }
  }, [isAuthenticated, userLoading]);

  const value = {
    store,
    loading,
    fetchStore,
    setStore,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
