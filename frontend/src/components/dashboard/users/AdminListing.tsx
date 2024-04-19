import UserAvatar from "@/components/UserAvatar";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { apiUrlClient } from "@/lib/consts";
import { User } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function AdminListing({
  user,
  numAdmins,
}: {
  user: User;
  numAdmins: number;
}) {
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
      {numAdmins > 1 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="max-w-fit justify-self-end">
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="text-lg font-bold">
              {user.id != currentUser?.id
                ? `Revoke admin privileges from ${user.name}?`
                : "Revoke your own admin privileges?"}
            </AlertDialogHeader>
            <AlertDialogDescription>
              {user.id != currentUser?.id
                ? "You can always add them back later"
                : "You'll need another admin to add you back."}
              .
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={() => removeAdmin.mutate(user.id)}>
                  Remove
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
