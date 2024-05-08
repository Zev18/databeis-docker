"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSettings() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Change the theme of the Databeis.</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted && (
          <div className="flex flex-col gap-2 md:flex-row">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "w-full rounded-md border-2 p-1 transition-all duration-150 md:w-[200px]",
                theme === "light"
                  ? "border-primary"
                  : "border-accent hover:border-primary/40",
              )}
            >
              <div className="items-center rounded-md border-2 border-muted bg-popover p-1 opacity-100 hover:bg-accent hover:text-accent-foreground dark:opacity-90">
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Light
              </span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-md border-2 p-4 transition-all duration-150",
                theme === "system"
                  ? "border-primary"
                  : "border-accent hover:border-primary/40",
              )}
            >
              <Laptop />
              <p>System</p>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "w-full rounded-md border-2 p-1 transition-all duration-150 md:w-[200px]",
                theme === "dark"
                  ? "border-primary"
                  : "border-accent hover:border-primary/40",
              )}
            >
              <div className="items-center rounded-md border-2 border-muted bg-popover p-1 opacity-90 hover:bg-accent hover:text-accent-foreground dark:opacity-100">
                <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                  <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Dark
              </span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
