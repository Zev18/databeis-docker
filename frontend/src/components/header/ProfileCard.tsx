"use client";

import Login from "@/app/Login";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { Skeleton } from "../ui/skeleton";

export default function ProfileCard() {
  const { userData, ready } = useAuthContext();

  return ready ? (
    userData ? (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={userData.avatarUrl} />
            <AvatarFallback>{userData.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      </DropdownMenu>
    ) : (
      <Login />
    )
  ) : (
    <Skeleton className="h-10 w-10 rounded-full" />
  );
}
