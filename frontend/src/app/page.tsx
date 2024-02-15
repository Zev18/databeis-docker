import { apiUrlServer, delimiter } from "@/lib/consts";
import { SfarimQuery } from "@/lib/types";
import { formatQueryParams, trimStrings } from "@/lib/utils";
import Searchbar from "./Searchbar";
import Sfarim from "./Sfarim";

const fetchInitialSfarim = async (q: SfarimQuery) => {
  const url = new URL(apiUrlServer + "/api/sfarim");
  if (q.query) url.searchParams.set("query", q.query);
  if (q.categories)
    url.searchParams.set("categories", q.categories.join(delimiter));
  if (q.languages)
    url.searchParams.set("language", q.languages.join(delimiter));
  if (q.page) url.searchParams.set("page", q.page.toString());
  if (q.perPage) url.searchParams.set("perPage", q.perPage.toString());
  console.log(url.toString());
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = formatQueryParams(searchParams);
  const initialSfarim = trimStrings(await fetchInitialSfarim(q));

  console.log(initialSfarim);

  return (
    <div className="m-4 flex flex-col gap-4">
      <Searchbar />
      <Sfarim initialSfarim={initialSfarim} />
    </div>
  );
}
