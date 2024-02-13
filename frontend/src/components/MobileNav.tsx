"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Menu } from "lucide-react";
import MobileMenu from "./header/MobileMenu";
import { Button } from "./ui/button";

export default function MobileNav() {
  const { isLoggedIn } = useAuthStore.getState();

  return (
    isLoggedIn && (
      <div className="fixed inset-0 w-full h-full p-4 flex justify-end items-end pointer-events-none sm:hidden">
        <MobileMenu asChild>
          <Button variant="secondary" className="pointer-events-auto">
            <Menu />
          </Button>
        </MobileMenu>
      </div>
    )
  );
}
