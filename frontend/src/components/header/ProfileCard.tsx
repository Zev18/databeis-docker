"use client";

import Login from "@/components/header/Login";
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
import { apiUrlClient } from "@/lib/consts";
import { useAtom } from "jotai";
import { navOpenAtom } from "@/store/atoms";

const iconSize = 18;

export default function ProfileCard() {
  const { isLoggedIn, user, logoutUser } = useAuthStore.getState();
  const [pages, setPages] = useState(menuPages);

  const [navOpen, setNavOpen] = useAtom(navOpenAtom);

  const router = useRouter();

  const logout = async () => {
    logoutUser();
    await fetch(apiUrlClient + "/api/logout", {
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

  return isLoggedIn ? (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="hidden sm:block">
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
      <UserAvatar
        user={user}
        onClick={() => setNavOpen((prev) => !prev)}
        className="sm:hidden"
      />
    </>
  ) : (
    <Login />
  );
}
