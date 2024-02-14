import { apiUrlClient } from "@/lib/consts";

export const fetchSfarim = async ({ pageParam = 0 }) => {
  const url = new URL(apiUrlClient + "/api/sfarim");
  url.searchParams.set("page", pageParam.toString());
  const res = await fetch(url.toString());
  return res.json();
};
