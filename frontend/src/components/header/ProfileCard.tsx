"use client";

import Login from "@/app/Login";
import { useBreakpoint } from "@/app/hooks/useBreakpoint";
import { menuPages } from "@/lib/data";
import { useAuthStore } from "@/store/useAuthStore";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import MobileMenu from "./MobileMenu";

const iconSize = 18;

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProfileCard() {
  const { isLoggedIn, user, logoutUser } = useAuthStore.getState();
  console.log("logged in: " + isLoggedIn);
  const { isAboveSm } = useBreakpoint("sm");
  const [pages, setPages] = useState(menuPages);

  const router = useRouter();

  const logout = async () => {
    logoutUser();
    await fetch(apiUrl + "/api/logout", {
      credentials: "include",
    });
    router.refresh();
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      user?.isAdmin &&
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
  }, [isLoggedIn, user?.isAdmin, pages]);

  useEffect(() => {
    console.log(isLoggedIn);
    console.log(user);
  }, [isLoggedIn, user]);

  return isLoggedIn ? (
    isAboveSm ? (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar user={user} />
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
        <UserAvatar user={user} />
      </MobileMenu>
    )
  ) : (
    <Login />
  );
}
