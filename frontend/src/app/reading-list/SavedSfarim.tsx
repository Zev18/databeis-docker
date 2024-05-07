"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import { useSfarim } from "@/hooks/useSfarim";
import { apiUrlClient } from "@/lib/consts";
import { SfarimQuery } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { openSeferAtom } from "@/store/atoms";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Bookmark, Loader2, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import SeferCard from "../SeferCard";
import SfarimDetail from "../SfarimDetail";
import { revalidate } from "../actions";
import Link from "next/link";

export default function SavedSfarim({
  initialSfarim,
}: {
  initialSfarim: Record<string, any>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { sfarim = initialSfarim, isPending } = useSfarim({
    bookmarks: true,
  });
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuthStore.getState();
  const isAdmin = user?.isAdmin;
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isDeleting, setIsDeleting] = useState(false);
  const [openSefer, setOpenSefer] = useAtom(openSeferAtom);

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(apiUrlClient + "/api/sfarim/bookmark/" + id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      return await res.json();
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: async () => {
      revalidate();
      return await queryClient.invalidateQueries({ queryKey: ["sfarim"] });
    },
  });

  const toggleBookmark = (id: number) => {
    if (!isLoggedIn || !id) return;
    setBookmarked((prev) => !prev);
    mutation.mutate(id);
  };

  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(
      openSefer?.users.some((u: Record<string, any>) => u.ID === user?.id),
    );
  }, [openSefer, user?.id]);

  const deleteSefer = useMutation({
    mutationFn: (id: number) => {
      return fetch(`${apiUrlClient}/api/sfarim/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "DELETE",
      });
    },
    onError: (error) => {
      toast.error("Deletion unsuccessful", { description: error.message });
    },
    onSuccess: async () => {
      toast.success("Deletion successful", {
        description: openSefer
          ? `"${capitalize(openSefer.title)}" deleted`
          : "Sefer deleted",
      });
      setOpenSefer(null);
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      revalidate();
    },
  });

  const refetchSfarim = useCallback(async () => {
    const url = new URL(apiUrlClient + "/api/sfarim/saved");
  }, []);

  useDebouncedEffect(
    () => {
      refetchSfarim();
    },
    { timeout: 100 },
    [refetchSfarim],
  );

  return isMounted && isPending ? (
    <div>
      <Loader2 className="animate-spin" />
    </div>
  ) : sfarim.length > 0 ? (
    <>
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          {sfarim.length > 0 && (
            <div>
              <p>
                {sfarim.length} saved{" "}
                {sfarim.length === 1 ? "sefer." : "sfarim."}
              </p>
            </div>
          )}
          {sfarim.map((sefer: Record<string, any>) => (
            <SeferCard key={sefer.ID} sefer={sefer} />
          ))}
        </div>
      </div>
      <Dialog
        open={openSefer != null}
        onOpenChange={() => {
          setOpenSefer((prev) => (prev == null ? openSefer : null));
          setIsDeleting(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{openSefer?.title}</DialogTitle>
            {openSefer?.description && (
              <DialogDescription>{openSefer?.description}</DialogDescription>
            )}
          </DialogHeader>
          <SfarimDetail sefer={openSefer} />
          {isAdmin &&
            (isDeleting ? (
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <h3 className="text-xl">
                  Delete {openSefer?.title}? For real?
                </h3>
                <p>This can&apos;t be undone.</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="grow"
                    variant="secondary"
                    onClick={() => setIsDeleting(false)}
                  >
                    Actually nah
                  </Button>
                  <Button
                    variant="destructive"
                    className="grow"
                    disabled={deleteSefer.isPending}
                    onClick={() => deleteSefer.mutate(openSefer?.ID)}
                  >
                    {deleteSefer.isPending && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Yes!!!!
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-row-reverse gap-2">
                <Button
                  className="grow"
                  onClick={() => {
                    setOpenSefer(null);
                    router.push(`/sefer/${openSefer?.ID}/edit`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleting(true)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toggleBookmark(openSefer?.ID)}
            >
              {bookmarked ? (
                <>
                  <Bookmark size={18} fill="currentColor" className="mr-2" />
                  <p>Unbookmark</p>
                </>
              ) : (
                <>
                  <Bookmark size={18} className="mr-2" />
                  <p>Bookmark</p>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  ) : (
    <div className="mt-10">
      <h3 className="text-xl">You have no saved sfarim.</h3>
      <p className="text-foreground/60">
        Bookmark a sefer to add it to your reading list.
      </p>
      <Button asChild>
        <Link href="/" className="mt-6">
          Back to home
        </Link>
      </Button>
    </div>
  );
}
