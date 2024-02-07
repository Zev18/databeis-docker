import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";

export default function UserAvatar({ user }: { user: User | null }) {
  return (
    <Avatar>
      <AvatarImage src={user?.avatarUrl} />
      <AvatarFallback>
        {user?.name ? user?.name[0].toUpperCase() : ""}
      </AvatarFallback>
    </Avatar>
  );
}
