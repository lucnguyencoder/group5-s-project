import React, { useEffect, useState } from "react";
import PersonalInfoForm from "@/components/modules/account/PersonalInfoForm";
import DeliveryInfoForm from "@/components/modules/account/DeliveryInfoForm";
import HelperForm from "@/components/modules/account/HelperForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, MapPin, User2 } from "lucide-react";
import SetTitle from "@/components/common/SetTitle";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("you");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["you", "delivery", "support"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <SetTitle title="My Account" />
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mx-auto rounded-full mt-4 mb-6 bg-muted border border-secondary/20 p-1 h-auto space-x-1">
          <TabsTrigger
            value="you"
            className={
              "text-md px-4 rounded-full hover:bg-secondary/10 border-none"
            }
          >
            <User2 className="mr-1" />
            You
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className={
              "text-md px-4 rounded-full hover:bg-secondary/10 border-none"
            }
          >
            <MapPin className="mr-1" />
            Delivery Address
          </TabsTrigger>
          <TabsTrigger
            value="support"
            className={
              "text-md px-4 rounded-full hover:bg-secondary/10 border-none"
            }
          >
            <Handshake className="mr-1" />
            Support
          </TabsTrigger>
        </TabsList>
        <TabsContent value="you">
          <div className="flex flex-col gap-6">
            <PersonalInfoForm />
          </div>
        </TabsContent>
        <TabsContent value="delivery">
          <DeliveryInfoForm />
        </TabsContent>
        <TabsContent value="support">
          <HelperForm />
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"></div>
    </div>
  );
};

export default AccountPage;
