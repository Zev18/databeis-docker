"use client";

import { apiUrlClient } from "@/lib/consts";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SeferCard from "../app/SeferCard";
import { trimStrings } from "@/lib/utils";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { openSeferAtom } from "@/store/atoms";
import SfarimDetail from "../app/SfarimDetail";

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

  const [openSefer, setOpenSefer] = useAtom(openSeferAtom);

  const [query] = useQueryState("query");
  const [language] = useQueryState("language");
  const [categories] = useQueryState("categories");
  const [page, setPage] = useState(1);

  const fetchMoreSfarim = async () => {
    const url = new URL(apiUrlClient + "/api/sfarim");
    if (query) url.searchParams.set("query", query);
    if (language) url.searchParams.set("language", language);
    if (categories) url.searchParams.set("categories", categories);
    if (page) url.searchParams.set("page", pagination.nextPage.toString());
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      const newSfarim = trimStrings(await res.json());
      setSfarim((prev) => [...prev, ...newSfarim.data]);
      setPagination(newSfarim.pagination);
      setPage(newSfarim.pagination.currentPage + 1);
    } catch (e) {
      console.log(e);
    }
  };

  const refetchSfarim = useCallback(async () => {
    const url = new URL(apiUrlClient + "/api/sfarim");
    if (query) url.searchParams.set("query", query);
    if (language) url.searchParams.set("language", language);
    if (categories) url.searchParams.set("categories", categories);
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
  }, [query, language, categories]);

  useDebouncedEffect(
    () => {
      refetchSfarim();
    },
    { timeout: 100 },
    [refetchSfarim],
  );

  return (
    <>
      <InfiniteScroll
        dataLength={sfarim.length}
        next={async () => await fetchMoreSfarim()}
        hasMore={pagination.currentPage < pagination.totalPages}
        loader={<h4>Loading...</h4>}
        endMessage={
          <div className="m-10 flex items-center justify-center">
            <p className="text-foreground/40">
              {sfarim.length > 0 ? "No more results" : "No results found"}
            </p>
          </div>
        }
      >
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
      </InfiniteScroll>
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
