"use client";

import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

export default function Searchbar() {
  const [query, setQuery] = useQueryState("query");
  const [language, setLanguage] = useQueryState("language");
  const [categories, setCategories] = useQueryState("categories");

  return (
    <div>
      <Input type="text" placeholder="Search sfarim..." />
    </div>
  );
}
