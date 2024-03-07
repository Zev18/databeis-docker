"use client";

import Logout from "@/app/Logout";
import { menuPages } from "@/lib/data";
import { useAuthStore } from "@/store/useAuthStore";
import { Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ReactNode, createElement, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "../ui/drawer";
import { useAtom } from "jotai";
import { navOpenAtom } from "@/store/atoms";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const iconSize = 20;

export default function MobileMenu({
  children,
  asChild,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const [pages, setPages] = useState(menuPages);
  const { isLoggedIn, user } = useAuthStore.getState();

  const path = usePathname();

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
  }, [isLoggedIn, user, pages]);

  const [navOpen, setNavOpen] = useAtom(navOpenAtom);

  return (
    <Drawer open={navOpen} onOpenChange={setNavOpen}>
      <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col gap-6 p-8 pb-2">
          {pages.map((page) => (
            <div key={page.name}>
              <Link
                href={page.path}
                className="flex items-center gap-2 text-lg font-medium"
                onClick={() => setNavOpen(false)}
              >
                {createElement(page.icon, { size: iconSize })}
                <span>{page.name}</span>
              </Link>
            </div>
          ))}
        </div>
        <DrawerFooter className="w-full flex-row">
          {path !== "/" && (
            <Button asChild variant="secondary">
              <Link
                href="/"
                className="flex w-full items-center gap-2 text-lg"
                onClick={() => setNavOpen(false)}
              >
                <Home size={iconSize} />
                <span>Home</span>
              </Link>
            </Button>
          )}
          <Logout />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
