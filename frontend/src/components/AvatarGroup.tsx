import React from "react";
import UserAvatar from "./UserAvatar";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AvatarGroup({
  users,
  size = "sm",
  className,
}: {
  users: User[] | Record<string, any>[];
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      {users.slice(0, 7).map((user: Record<string, any>, index) => (
        <div key={index}>
          <UserAvatar className="ml-[-10px]" user={user} size={size} border />
        </div>
      ))}
      {users.length > 7 && <p className="ml-1">+{users.length - 7}</p>}
    </div>
  );
}
