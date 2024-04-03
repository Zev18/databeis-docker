import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="mt-[15rem] flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Sefer not found</h2>
        <p>Seems like no sefer with that id exists.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
