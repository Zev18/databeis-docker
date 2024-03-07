"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Logout() {
  const { logoutUser, isLoggedIn } = useAuthStore();
  const router = useRouter();

  const logout = async () => {
    await fetch(apiUrl + "/api/logout", {
      credentials: "include",
    });
    logoutUser();
    router.refresh();
  };
  return (
    isLoggedIn && (
      <Button onClick={logout} className="w-full">
        <LogOut size={18} className="mr-2" /> Logout
      </Button>
    )
  );
}
