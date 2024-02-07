"use client";

import { useBreakpoint } from "@/app/hooks/useBreakpoint";
import { useEffect, useState } from "react";
import MobileMenu from "./header/MobileMenu";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function MobileNav() {
  const { isAboveSm } = useBreakpoint("sm");
  const [ready, isReady] = useState(false);

  useEffect(() => {
    isReady(true);
  }, []);

  if (!ready || isAboveSm) return;

  return (
    <div className="fixed inset-0 w-full h-full p-4 flex justify-end items-end pointer-events-none">
      <MobileMenu asChild>
        <Button variant="secondary" className="pointer-events-auto">
          <Menu />
        </Button>
      </MobileMenu>
    </div>
  );
}
