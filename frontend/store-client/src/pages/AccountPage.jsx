import React from "react";
import ChangePasswordForm from "@/components/modules/account/ChangePasswordForm";
import PersonalInfoForm from "@/components/modules/account/PersonalInfoForm";
import SetTitle from "@/components/common/SetTitle";

const AccountPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <SetTitle title="My Profile" />
      <h1 className="text-4xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-4">
          <PersonalInfoForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
