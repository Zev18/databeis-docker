"use client";

import { Input } from "@/components/ui/input";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function Searchbar() {
  const [query, setQuery] = useQueryState("query");
  const [searchVal, setSearchVal] = useState(query);

  useEffect(() => {
    if (searchVal == "") {
      setSearchVal(null);
    }
  }, [searchVal]);

  useDebouncedEffect(
    () => {
      setQuery(searchVal);
    },
    { timeout: 200 },
    [searchVal],
  );

  return (
    <div className="relative inline-block">
      <Input
        type="text"
        value={searchVal || ""}
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Search sfarim..."
      />
      {query != "" && (
        <button
          aria-label="clear search"
          title="clear search"
          className="absolute right-4 top-[50%] inline-flex -translate-y-[50%]"
          onClick={() => {
            setQuery(null);
            setSearchVal(null);
          }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
