"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Login() {
  const { userData } = useAuthContext();

  const login = () => {
    window.location.href = apiUrl + "/api/login";
  };

  return /*!userData &&*/ <Button onClick={login}>Login</Button>;
}
