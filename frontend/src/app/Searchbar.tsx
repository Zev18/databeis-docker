"use client";

import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { useState } from "react";

export default function Searchbar() {
  const [query, setQuery] = useQueryState("query");
  const [queryState, setQueryState] = useState(query);
  const [language, setLanguage] = useQueryState("language");
  const [categories, setCategories] = useQueryState("categories");

  return (
    <div>
      <Input
        type="text"
        value={query || ""}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search sfarim..."
      />
    </div>
  );
}
