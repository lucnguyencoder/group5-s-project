import { useUser } from "@/context/UserContext";
import React from "react";

function PrivateComponents({ url, method, children }) {
  const { permissions, isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return null;
  }

  if (permissions && permissions.length > 0) {
    const hasPermission = permissions.some(
      (perm) => perm.url === url && (!method || perm.method === method)
    );

    console.log("Permissions:", permissions);
    console.log("Required URL:", url);

    if (!hasPermission) {
      return null;
    } else {
      return <>{children}</>;
    }
  }
}

export default PrivateComponents;
