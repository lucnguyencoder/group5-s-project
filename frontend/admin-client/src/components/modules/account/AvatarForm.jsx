import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { useUser } from "@/context/UserContext";
import React from "react";
import UserAvatar from "../common/UserAvatar";
import { Edit } from "lucide-react";

function AvatarForm() {
  //   const { user, logout } = useUser();
  return (
    <VerticalAccountCard
      title="Avatar"
      footer={
        <Button size={"sm"} variant={"outline"}>
          <Edit />
          Edit
        </Button>
      }
    >
      <div className="flex items-center justify-center w-full">
        <UserAvatar className="w-20 h-20" />
      </div>
    </VerticalAccountCard>
  );
}

export default AvatarForm;
