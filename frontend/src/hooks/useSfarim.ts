import { trimStrings } from "./../lib/utils";
import { useCallback, useEffect, useState } from "react";
import { apiUrlClient, delimiter } from "@/lib/consts";
import { SfarimQuery } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

export const useSfarim = ({
  initial,
  q = {},
}: {
  initial?: Record<string, any>;
  q?: SfarimQuery;
}) => {
  const [query, setQuery] = useQueryState("query");
  const [categories, setCategories] = useQueryState("categories");
  const [languages, setLanguages] = useQueryState("language");
  const [page, setPage] = useQueryState("page");
  const [perPage, setPerPage] = useQueryState("perPage");

  const getState = useCallback(() => {
    const state: SfarimQuery = {};
    if (query) state.query = query;
    if (categories) state.categories = categories.split(delimiter);
    if (languages) state.languages = languages.split(delimiter);
    if (page) state.page = Number(page);
    if (perPage) state.perPage = Number(perPage);

    return state;
  }, [query, categories, languages, page, perPage]);

  const [newQ, setNewQ] = useState(getState());

  useEffect(() => {
    setNewQ(getState());
  }, [getState]);

  const sQuery = useQuery<Record<string, any>, Error>({
    queryKey: ["sfarim", newQ || q],
    queryFn: async () => trimStrings(await fetchSfarim(newQ || q)),
    staleTime: 1000 * 60 * 10,
  });

  return {
    ...sQuery,
    sfarim: sQuery.data?.data,
    pagination: sQuery.data?.pagination,
  };
};

const fetchSfarim = async (q: SfarimQuery) => {
  const url = new URL(apiUrlClient + "/api/sfarim");
  if (q.query) url.searchParams.set("query", q.query);
  if (q.categories)
    url.searchParams.set("categories", q.categories.join(delimiter));
  if (q.languages)
    url.searchParams.set("language", q.languages.join(delimiter));
  if (q.page) url.searchParams.set("page", q.page.toString());
  if (q.perPage) url.searchParams.set("perPage", q.perPage.toString());
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return { data: data.data, pagination: data.pagination };
};
