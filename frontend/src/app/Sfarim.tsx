"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import { apiUrlClient } from "@/lib/consts";
import { setUrlPage, trimStrings } from "@/lib/utils";
import { openSeferAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import SeferCard from "./SeferCard";
import SfarimDetail from "./SfarimDetail";
import SfarimPagination from "@/components/SfarimPagination";
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
        onOpenChange={() =>
          setOpenSefer((prev) => (prev == null ? openSefer : null))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{openSefer?.title}</DialogTitle>
            {openSefer?.description && (
              <DialogDescription>{openSefer?.description}</DialogDescription>
            )}
          </DialogHeader>
          <SfarimDetail sefer={openSefer} />
        </DialogContent>
      </Dialog>
    </>
  );
}
