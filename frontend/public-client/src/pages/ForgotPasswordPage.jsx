import React from "react";
import ForgotPasswordForm from "../components/modules/auth/ForgotPasswordForm";
import { Link } from "react-router-dom";
import SetTitle from "@/components/common/SetTitle";


const ForgotPasswordPage = () => {
  return (
    <>
      <SetTitle title="Forgot Password" />
      <ForgotPasswordForm />
    </>
  );
};

export default ForgotPasswordPage;
