import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Loader2 } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, accountDisabled } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (accountDisabled) {
    return (
      <Navigate
        to="/error"
        state={{ message: "Oops, your account is disabled" }}
        replace
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export default PrivateRoute;
