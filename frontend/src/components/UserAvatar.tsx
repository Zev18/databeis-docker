import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/types";

export default function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatarUrl} />
      <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
