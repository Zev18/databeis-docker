"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Menu } from "lucide-react";
import MobileMenu from "./header/MobileMenu";
import { Button } from "./ui/button";

export default function MobileNav() {
  const { isLoggedIn } = useAuthStore.getState();

  return (
    isLoggedIn && (
      <div className="pointer-events-none fixed inset-0 z-30 flex h-full w-full items-end justify-end p-4 sm:hidden">
        <MobileMenu asChild>
          <Button
            variant="secondary"
            className="pointer-events-auto border shadow-lg"
          >
            <Menu />
          </Button>
        </MobileMenu>
      </div>
    )
  );
}
