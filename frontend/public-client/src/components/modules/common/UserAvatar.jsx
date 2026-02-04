import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { getInitials } from "@/utils/formatter";
import { User2 } from "lucide-react";
import React from "react";

function UserAvatar({ ...props }) {
  const { user } = useUser();
  if (!user) {
    return (
      <Avatar {...props}>
        <AvatarFallback>
          <User2 className="opacity-25" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar {...props}>
      <AvatarImage src={user?.profile_picture} alt="@shadcn" />
      <AvatarFallback>{getInitials(user?.profile?.full_name)}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
