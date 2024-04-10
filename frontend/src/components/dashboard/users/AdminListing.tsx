import UserAvatar from "@/components/UserAvatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { apiUrlClient } from "@/lib/consts";
import { User } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function AdminListing({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const { user: currentUser } = useAuthStore();

  const removeAdmin = useMutation({
    mutationFn: async (userId: number) => {
      return await fetch(
        `${apiUrlClient}/api/users/remove-admin?ids=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  return (
    <div className="grid grid-cols-2 items-center gap-4 p-2 md:grid-cols-[200px_1fr_100px]">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} />
        <p>{user.name}</p>
      </div>
      <p className="hidden text-foreground/60 md:block">{user.email}</p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="max-w-fit justify-self-end">
            Remove
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            Revoke admin privileges from {user.name}?
          </AlertDialogHeader>
          <AlertDialogDescription>
            You can always add them back later.
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
