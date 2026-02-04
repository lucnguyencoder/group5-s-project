import { createContext, useContext } from "react";

export const UserRoleContext = createContext({
  userRole: "customer",
  setUserRole: () => {},
});

export const useUserRole = () => useContext(UserRoleContext);