import React from "react";
import { useParams, Navigate } from "react-router-dom";
import LoginForm from "../components/modules/auth/LoginForm";

const AuthenticatePage = () => {
  const { type } = useParams();

  switch (type) {
    case "login":
      return <LoginForm />;
    default:
      return <Navigate to="/auth/login" replace />;
  }
};

export default AuthenticatePage;
