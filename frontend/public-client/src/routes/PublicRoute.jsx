import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Loader2 } from "lucide-react";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default PublicRoute;
