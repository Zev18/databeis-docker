"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Logout() {
  const { userData, setUserData } = useAuthContext();

  const logout = async () => {
    await fetch(apiUrl + "/api/logout", {
      credentials: "include",
    });
    setUserData(null);
    localStorage.removeItem("user");
  };
  return (
    !!userData && (
      <Button onClick={logout}>
        <LogOut className="mr-2" /> Logout
      </Button>
    )
  );
}
