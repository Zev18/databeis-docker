"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Login({
  large,
  className,
}: {
  large?: boolean;
  className?: string;
}) {
  const login = () => {
    window.location.href = apiUrl + "/api/login";
  };

  return (
    <Button
      onClick={login}
      className={cn(className, large && "text-base")}
      variant={large ? "outline" : "default"}
      size={large ? "lg" : "default"}
    >
      {large ? "Login with Google" : "Login"}
    </Button>
  );
}
