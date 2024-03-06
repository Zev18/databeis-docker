import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@/lib/types";
import { capitalizeEverything, hiRes } from "@/lib/utils";
import { GraduationCap, ShieldCheck, Tag } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

const iconSize = 18;

export default function UserCard({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) {
  return (
    <TooltipProvider>
      <Card className="w-full max-w-xl">
        <CardContent className="p-4">
          <div className="flex w-full items-center gap-4">
            <div className="relative h-fit">
              <Image
                src={hiRes(256, user.avatarUrl)}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
              <Tooltip>
                <TooltipTrigger className="absolute bottom-0 right-0 flex  items-center justify-center rounded-full border-2 bg-secondary p-1 text-foreground/80 shadow">
                  <ShieldCheck size={18} />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Admin</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl">{user.name}</h3>
              <p className="text-foreground/60">{user.email}</p>
              {(user.affiliation || user.gradYear) && (
                <div className="flex items-center gap-2">
                  {user.affiliation && (
                    <Badge
                      className="flex items-center gap-2"
                      variant="secondary"
                    >
                      <Tag size={iconSize} className="p-[2px]" />
                      <p>{capitalizeEverything(user.affiliation)}</p>
                    </Badge>
                  )}
                  {user.gradYear && (
                    <Badge
                      className="flex items-center gap-2"
                      variant="secondary"
                    >
                      <GraduationCap size={iconSize} className="p-[1px]" />
                      <p>{user.gradYear}</p>
                    </Badge>
                  )}
                </div>
              )}
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
