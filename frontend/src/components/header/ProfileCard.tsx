"use client";

import Login from "@/app/Login";
import { useBreakpoint } from "@/app/hooks/useBreakpoint";
import { useAuthContext } from "@/context/AuthContext";
import { menuPages } from "@/lib/data";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { createElement, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import MobileMenu from "./MobileMenu";

const iconSize = 18;

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProfileCard() {
  const { userData, setUserData, ready } = useAuthContext();
  const { isAboveSm } = useBreakpoint("sm");
  const [pages, setPages] = useState(menuPages);

  const logout = async () => {
    await fetch(apiUrl + "/api/logout", {
      credentials: "include",
    });
    setUserData(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (
      ready &&
      userData?.isAdmin &&
      !pages.some((page) => page.name === "Admin dashboard")
    ) {
      const updatedPages = [
        ...pages.slice(0, 1),
        {
          name: "Admin dashboard",
          path: "/admin",
          icon: LayoutDashboard,
        },
        ...pages.slice(1),
      ];
      setPages(updatedPages);
    }
  }, [ready, userData?.isAdmin, pages]);

  return ready ? (
    userData ? (
      isAboveSm ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserAvatar user={userData} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            {pages.map((page) => (
              <DropdownMenuItem
                asChild
                key={page.name}
                className="flex items-center gap-2 pr-4">
                <Link href={page.path}>
                  {createElement(page.icon, { size: iconSize })}
                  <span>{page.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={logout}>
              <LogOut size={iconSize} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <MobileMenu>
          <UserAvatar user={userData} />
        </MobileMenu>
      )
    ) : (
      <Login />
    )
  ) : (
    <Skeleton className="h-10 w-10 rounded-full" />
  );
}
