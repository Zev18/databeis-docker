"use client";

import { useAuthContext } from "@/context/AuthContext";

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
  return !!userData && <button onClick={logout}>Logout</button>;
}
