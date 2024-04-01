"use client";

import SfarimPagination from "@/components/SfarimPagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import { apiUrlClient } from "@/lib/consts";
import { capitalize, trimStrings } from "@/lib/utils";
import { openSeferAtom } from "@/store/atoms";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import SeferCard from "./SeferCard";
import SfarimDetail from "./SfarimDetail";
import { revalidate } from "./actions";

export default function Sfarim({
  initialSfarim,
}: {
  initialSfarim: Record<string, any>;
}) {
  const [sfarim, setSfarim] = useState<Record<string, any>[]>(
    initialSfarim.data,
  );
  const [pagination, setPagination] = useState<Record<string, any>>(
    initialSfarim.pagination,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuthStore.getState();
  const isAdmin = user?.isAdmin;

  const params = useSearchParams();

  const router = useRouter();

  const [openSefer, setOpenSefer] = useAtom(openSeferAtom);

  const [query] = useQueryState("query");
  const [language] = useQueryState("language");
  const [categories] = useQueryState("categories");

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
    onSuccess: async (data) => {
      toast.success("Deletion successful", {
        description: openSefer
          ? `"${capitalize(openSefer.title)}" deleted`
          : "Sefer deleted",
      });
      setOpenSefer(null);
      const newData = trimStrings(await fetchInitialSfarim(params.toString()));
      setSfarim(newData.data);
      setPagination(newData.pagination);
    },
  });

  useEffect(() => {
    setPagination(initialSfarim.pagination);
  }, [initialSfarim.pagination]);

  const refetchSfarim = useCallback(async () => {
    const url = new URL(apiUrlClient + "/api/sfarim");
    if (query) url.searchParams.set("query", query);
    if (language) url.searchParams.set("language", language);
    if (categories) url.searchParams.set("categories", categories);
    if (pagination.currentPage)
      url.searchParams.set("page", pagination.currentPage);
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      const newSfarim = trimStrings(await res.json());
      setSfarim(newSfarim.data);
      setPagination(newSfarim.pagination);
    } catch (e) {
      console.log(e);
    }
    revalidate();
  }, [query, language, categories, pagination.currentPage]);

  useDebouncedEffect(
    () => {
      refetchSfarim();
    },
    { timeout: 100 },
    [refetchSfarim],
  );

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          {sfarim.length > 0 && (
            <div>
              <p>{pagination.totalRows} results found.</p>
            </div>
          )}
          {sfarim.map((sefer: Record<string, any>) => (
            <SeferCard key={sefer.ID} sefer={sefer} />
          ))}
        </div>
      </div>
      <SfarimPagination pagination={pagination} params={params} />
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
        </DialogContent>
      </Dialog>
    </>
  );
}

const fetchInitialSfarim = async (q: string) => {
  const res = await fetch(apiUrlClient + "/api/sfarim?" + q, {
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};
