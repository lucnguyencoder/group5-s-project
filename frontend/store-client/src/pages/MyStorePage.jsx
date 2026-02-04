import React from "react";
import StoreInforForm from "../components/modules/store/StoreInforForm";
import SetTitle from "@/components/common/SetTitle";

const AccountPage = () => {
  return (
    <div className="space-y-2 py-4 max-w-6xl mx-auto w-full">
      <SetTitle title="Store Information" />
      <StoreInforForm />
    </div>
  );
};

export default AccountPage;
