import Button12 from "@/components/common/Button12";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { storeService } from "@/services/basicService";
import { toast } from "sonner";
import PrivateComponents from "@/components/layout/PrivateComponents";

function PersonalInfoForm() {
  const { user, setUser } = useUser();
  const [checkIn, setCheckIn] = useState(user?.profile?.is_courier_active || false);
  const [loading, setLoading] = useState(false);
  const checkInOut = async () => {
    setLoading(true);
    try {
      const response = await storeService.setCheckInOut(user?.id);
      console.log(response);
      if (response.success) {
        setCheckIn(response.isActive);
        setUser((prev) => ({ ...prev, profile: { ...prev.profile, is_courier_active: response.isActive } }));
      } else {
        toast.error(response.message || "Failed to update check-in status");
      }
    }
    catch (error) {
      console.error("Error updating check-in status:", error);
      toast.error("An error occurred while updating check-in status");
    }
    finally {
      setLoading(false);
    }
  }
  console.log(user)
  return (
    <>
      <PrivateComponents url={'/api/store/staff/checkIn/:staffId'} method="PUT">
        <VerticalAccountCard title="Basic Information">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex-1">
              <Button12
                title="Check In/Out"
                variant="ghost"
                description={user?.profile?.is_courier_active ? "Active" : "Inactive"}
                onClick={checkInOut}
                disabled={loading}
              />
            </div>
            <Switch checked={checkIn} onCheckedChange={checkInOut} disabled={loading} className="ml-4" />
          </div>
        </VerticalAccountCard>
      </PrivateComponents>
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mb-4 flex items-center gap-4">
        <AlertCircle className="w-5 h-5 mr-2 text-primary" />
        <span className="text-primary text-md"><strong>This data below is view-only.</strong> {" "}
          Your information is only be edited and managed by your organization.
        </span>
      </div>
      <VerticalAccountCard title="Basic Information">
        {/* {JSON.stringify(user)} */}
        <div className="flex flex-col">
          <Button12
            title="Full Name"
            variant="ghost"
            description={user?.profile?.full_name || "No provided yet"}


          //   norounded
          />
          <Separator />

          <Button12
            title="User Name"
            variant="ghost"
            description={user?.profile?.username || "No provided yet"}


          //   norounded
          />
          <Separator />
          <Button12
            title="Email"
            variant="ghost"
            description={user?.email || "No provided yet"}
          //   norounded
          />
          <Separator />
          <Button12
            title="Phone Number"
            variant="ghost"
            description={user?.profile?.phone || "No provided yet"}

          />
        </div>
      </VerticalAccountCard>
    </>
  );
}

export default PersonalInfoForm;
