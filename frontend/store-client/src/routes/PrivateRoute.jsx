import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Loader2, OctagonMinus, ShieldAlert } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const PrivateRoute = ({ children, reqPerm, reqMethod }) => {
  const { isAuthenticated, loading, accountDisabled, permissions } = useUser();
  const { store } = useStore();
  const location = useLocation();

  if (!store?.isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <OctagonMinus className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold mt-4">Store is disabled by Yami.</h1>
        <p className="text-muted-foreground ">
          Please contact Yami support for more information.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
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
  if (reqPerm && permissions) {
    const hasPermission = permissions.some(
      (perm) =>
        perm.url === reqPerm && (!reqMethod || perm.method === reqMethod)
    );

    if (!hasPermission) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <ShieldAlert className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-xl font-semibold mt-4">Access Denied</h1>
          <p className="text-muted-foreground ">
            You do not have permission to access this page.
          </p>
        </div>
      );
    }
  }

  return children;
};

export default PrivateRoute;
