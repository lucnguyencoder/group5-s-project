import Button12 from "@/components/common/Button12";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Plus, UserIcon } from "lucide-react";
import React from "react";

function DeliveryInfoForm() {
  const { user, logout } = useUser();
  return (
    <VerticalAccountCard
      title="Delivery Information"
      footer={
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add new address
        </Button>
      }
    >
      <div className="flex flex-col gap-0">
        {user?.delivery ? null : (
          <p>
            Oops, we couldn't find your delivery information. Please add a new
            one!
          </p>
        )}
        {/* <Separator className="my-0 py-0" /> */}
      </div>
    </VerticalAccountCard>
  );
}

export default DeliveryInfoForm;
