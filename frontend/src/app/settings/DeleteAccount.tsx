"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiUrlClient, apiUrlServer } from "@/lib/consts";
import { useAuthStore } from "@/store/useAuthStore";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const router = useRouter();
  const { logoutUser } = useAuthStore();

  const deleteAccount = async () => {
    try {
      const res = await fetch(`${apiUrlClient}/api/users/delete-account`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("Your account has been deleted.");
        logoutUser();
        router.push("/");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (e: any) {
      toast.error("Something went wrong", {
        description: e.message,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/60">
          If, for some reason, you want to delete your account, you can do so
          here.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-6">
              <Trash2 className="mr-2" size={18} />
              Delete account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                Deleting your account is permanent, immediate, and can&apos;t be
                undone. Logging in with the same email will create a fresh
                account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={() => deleteAccount()}>
                  Delete account
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
