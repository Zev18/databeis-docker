import { useAuthContext } from "@/context/AuthContext";
import { menuPages } from "@/lib/data";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { createElement, useEffect } from "react";
import UserAvatar from "../UserAvatar";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "../ui/drawer";

const iconSize = 20;

export default function MobileMenu() {
  const pages = menuPages;
  const { userData, ready } = useAuthContext();

  useEffect(() => {
    if (
      ready &&
      userData?.isAdmin &&
      !pages.some((page) => page.name === "Admin dashboard")
    ) {
      pages.splice(1, 0, {
        name: "Admin dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      });
    }
  }, [ready, userData?.isAdmin, pages]);

  return (
    <Drawer>
      <DrawerTrigger>
        <UserAvatar user={userData} />
      </DrawerTrigger>
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
          <Button>
            <LogOut size={iconSize} className="mr-2" /> Logout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
