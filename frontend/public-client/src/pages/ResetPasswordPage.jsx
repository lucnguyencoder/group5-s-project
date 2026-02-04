import React from "react";
import ResetPasswordForm from "../components/modules/auth/ResetPasswordForm";
import SetTitle from "@/components/common/SetTitle";


const ResetPasswordPage = () => {
  return (
    <>
      <SetTitle title="Reset Password" />
      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
