import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";
import Image from "next/image";

export default function UserAvatar({ user }: { user: User | null }) {
  return (
    <Avatar>
      <Image
        alt={user?.name || ""}
        src={user?.avatarUrl || ""}
        referrerPolicy="no-referrer"
        fill
      />
    </Avatar>
  );
}
