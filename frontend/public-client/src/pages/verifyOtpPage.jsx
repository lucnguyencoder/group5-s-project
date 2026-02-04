import React from "react";
import VerifyOTPForm from "../components/modules/auth/verifyOtpForm";
import SetTitle from "@/components/common/SetTitle";


const VerifyOtpPage = () => {
    return (
        <>
            <SetTitle title="Verify OTP" />
            <VerifyOTPForm />
        </>
    );
};

export default VerifyOtpPage;