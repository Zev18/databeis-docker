import { useAuthContext } from "@/context/AuthContext";
import { menuPages } from "@/lib/data";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { ReactNode, createElement, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "../ui/drawer";
import Logout from "@/app/Logout";

const iconSize = 20;

export default function MobileMenu({
  children,
  asChild,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const [pages, setPages] = useState(menuPages);
  const { userData, ready } = useAuthContext();

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
  }, [ready, userData, pages]);

  return (
    <Drawer>
      <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col p-8 pb-2 gap-6">
          {pages.map((page) => (
            <div key={page.name}>
              <Link
                href={page.path}
                className="flex items-center gap-2 text-lg font-medium">
                {createElement(page.icon, { size: iconSize })}
                <span>{page.name}</span>
              </Link>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <Logout />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
