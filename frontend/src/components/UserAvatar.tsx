import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";

export default function UserAvatar({ user }: { user: User | null }) {
  console.log(user?.avatarUrl);
  return (
    <Avatar>
      <AvatarImage src={user?.avatarUrl} referrerPolicy="no-referrer" />
      <AvatarFallback>
        {user?.name ? user?.name[0].toUpperCase() : ""}
      </AvatarFallback>
    </Avatar>
  );
}
