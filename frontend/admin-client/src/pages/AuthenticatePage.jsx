import React from "react";
import { useParams, Navigate } from "react-router-dom";
import LoginForm from "../components/modules/auth/LoginForm";
import SetTitle from "@/components/common/SetTitle";

const AuthenticatePage = () => {
  const { type } = useParams();

  switch (type) {
    case "login":
      return (
        <>
          <SetTitle title="Login" />
          <LoginForm />
        </>
      );
    default:
      return <Navigate to="/auth/login" replace />;
  }
};

export default AuthenticatePage;
