import ProfileInformationCard from "@/components/common/ProfileInformationCard";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";
import { ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function SecurityForm() {
  const { user, toggle2Fa } = useUser();
  const [is2fa, set2Fa] = useState(user.is_enabled_2fa);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const response = await toggle2Fa(user?.id);
      if (response.success) {
        set2Fa(response.is_enabled_2fa);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = error.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Security</h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 *:grid-cols-1 gap-4">
        <div className="col-span-2">
          <ProfileInformationCard
            icon={<ShieldCheck />}
            title="Two-factor Authentication"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-muted-foreground">
                  Enhance your account security by enabling two-factor
                  authentication
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="two-factor-auth"
                  checked={is2fa || false}
                  onCheckedChange={handleToggle}
                  disabled={isToggling}
                />
                <Label htmlFor="two-factor-auth">
                  {is2fa ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </ProfileInformationCard>
        </div>
      </div>
    </div>
  );
}

export default SecurityForm;
