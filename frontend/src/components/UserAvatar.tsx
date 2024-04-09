import { User } from "@/lib/types";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type Size = "xs" | "sm" | "md" | "lg";

export default function UserAvatar({
  user,
  className,
  onClick,
  size = "md",
  border = false,
}: {
  user: User | Record<string, any> | null;
  className?: string;
  onClick?: () => void;
  size?: Size;
  border?: boolean;
}) {
  return (
    <Avatar
      className={cn(
        className,
        size === "xs"
          ? "size-5"
          : size === "sm"
            ? "size-7"
            : size === "md"
              ? "size-10"
              : "size-12",
        border ? "border-2 border-background" : "",
      )}
      onClick={onClick}
    >
      {user?.avatarUrl && (
        <Image
          alt={user?.name || ""}
          src={user?.avatarUrl || ""}
          referrerPolicy="no-referrer"
          fill
        />
      )}
      <AvatarFallback className="not-italic">
        {user?.name && user.name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
