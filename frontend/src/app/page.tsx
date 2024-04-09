import { apiUrlServer, delimiter } from "@/lib/consts";
import { SfarimQuery } from "@/lib/types";
import { formatQueryParams, trimStrings } from "@/lib/utils";
import Filters from "./Filters";
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
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

const fetchCategories = async () => {
  const url = new URL(apiUrlServer + "/api/categories");
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return { data };
};

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = formatQueryParams(searchParams);
  const initialSfarim = trimStrings(await fetchInitialSfarim(q));

  const categories = trimStrings(await fetchCategories());
  console.log(categories.data);

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="flex w-full max-w-3xl flex-col gap-2">
        <Searchbar />
        <Filters categories={categories.data} />
      </div>
      <Sfarim initialSfarim={initialSfarim} q={q} />
    </div>
  );
}
