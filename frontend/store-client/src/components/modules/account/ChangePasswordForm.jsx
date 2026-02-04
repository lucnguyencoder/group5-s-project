import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { useUser } from "@/context/UserContext";
import React from "react";
import Button12 from "@/components/common/Button12";
import { formatString } from "@/utils/formatter";
import { Separator } from "@/components/ui/separator";

function ChangePasswordForm() {
  const { user } = useUser();

  return (
    <VerticalAccountCard title={"Store Profile Information"}>
      <div className="flex flex-col">
        <Button12
          title={"Role"}
          variant="ghost"
          description={formatString(user?.group?.name)}
        />

        {user?.group?.name === "courier" && (
          <>
            <Separator />
            <Button12
              title={"Plate Number"}
              variant="ghost"
              description={formatString(user?.profile?.vehicle_plate)}
            />
            <Separator />
            <Button12
              title={"Vehicle Type"}
              variant="ghost"
              description={formatString(user?.profile?.vehicle_type)}
            />
          </>
        )}
      </div>
    </VerticalAccountCard>
  );
}

export default ChangePasswordForm;
