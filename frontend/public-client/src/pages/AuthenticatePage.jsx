import React from "react";
import { useParams, Navigate } from "react-router-dom";
import LoginForm from "../components/modules/auth/LoginForm";
import RegisterForm from "../components/modules/auth/RegisterForm";
import Verify2FaForm from "@/components/modules/auth/verify2FaForm";
import SetTitle from "@/components/common/SetTitle";


const AuthenticatePage = () => {
  const { type } = useParams();

  switch (type) {
    case "login":
      return (
        <>
          <SetTitle title={"Login"} />
          <LoginForm />
        </>
      );
    case "register":
      return (
        <>
          <SetTitle title={"Register"} />
          <RegisterForm />
        </>
      );
    case "verify":
      return (
        <>
          <SetTitle title={"Verify Email"} />
          <Verify2FaForm />
        </>
      );
    default:
      return <Navigate to="/auth/login" replace />;
  }
};

export default AuthenticatePage;
