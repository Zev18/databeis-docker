"use client";

import { apiUrlClient } from "@/lib/consts";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SeferCard from "./SeferCard";
import { trimStrings } from "@/lib/utils";

export default function Sfarim({
  initialSfarim,
}: {
  initialSfarim: Record<string, any>;
}) {
  const [sfarim, setSfarim] = useState<Record<string, any>[]>(
    initialSfarim.data
  );
  const [pagination, setPagination] = useState<Record<string, any>>(
    initialSfarim.pagination
  );

  const [query, setQuery] = useQueryState("query");
  const [language, setLanguage] = useQueryState("language");
  const [categories, setCategories] = useQueryState("categories");
  const [page, setPage] = useState(1);

  const fetchMoreSfarim = async () => {
    const url = new URL(apiUrlClient + "/api/sfarim");
    if (query) url.searchParams.set("query", query);
    if (language) url.searchParams.set("language", language);
    if (categories) url.searchParams.set("categories", categories);
    if (page) url.searchParams.set("page", (Number(page) + 1).toString());
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
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }>
      <div className="flex flex-col gap-4">
        {sfarim.map((sefer: Record<string, any>) => (
          <SeferCard key={sefer.ID} sefer={sefer} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
