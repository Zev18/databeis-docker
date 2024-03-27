"use client";

import SfarimPagination from "@/components/SfarimPagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import { apiUrlClient } from "@/lib/consts";
import { trimStrings } from "@/lib/utils";
import { openSeferAtom } from "@/store/atoms";
import { useAuthStore } from "@/store/useAuthStore";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import SeferCard from "./SeferCard";
import SfarimDetail from "./SfarimDetail";
import { revalidate } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2 } from "lucide-react";

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

  const [openSefer, setOpenSefer] = useAtom(openSeferAtom);

  const [query] = useQueryState("query");
  const [language] = useQueryState("language");
  const [categories] = useQueryState("categories");

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
                  <Button variant="destructive" className="grow">
                    Yes!!!!
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-row-reverse gap-2">
                <Button asChild className="grow">
                  <Link href={`/sefer/${openSefer?.ID}/edit`}>Edit</Link>
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
