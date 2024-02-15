import React from "react";
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AlertCircle } from "lucide-react";

export default function Unverified({ confirmed }: { confirmed: boolean }) {
  if (!confirmed)
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="text-foreground/60 inline pr-2">
            <AlertCircle size={14} />
          </TooltipTrigger>
          <TooltipContent collisionPadding={4}>
            <p>This sefer isn&apos;t confirmed to be on the shelf.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
}
