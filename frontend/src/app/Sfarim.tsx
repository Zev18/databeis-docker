"use client";

import { apiUrlClient } from "@/lib/consts";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SeferCard from "./SeferCard";
import { trimStrings } from "@/lib/utils";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";

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

  useEffect(() => {
    console.log(pagination);
  }, [pagination]);
  useEffect(() => {
    console.log(sfarim);
  }, [sfarim]);

  return (
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
      <div className="flex flex-col gap-4">
        {sfarim.length > 0 && (
          <div>
            <p>{pagination.totalRows} results found.</p>
          </div>
        )}
        {sfarim.map((sefer: Record<string, any>) => (
          <SeferCard key={sefer.ID} sefer={sefer} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
