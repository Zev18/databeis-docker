"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

export default function Searchbar() {
  const [query, setQuery] = useQueryState("query");

  useEffect(() => {
    if (query == "") {
      setQuery(null);
    }
  }, [query, setQuery]);

  return (
    <div className="relative inline-block">
      <Input
        type="text"
        value={query || ""}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search sfarim..."
      />
      {query != "" && (
        <button
          aria-label="clear search"
          title="clear search"
          className="absolute right-4 top-[50%] inline-flex -translate-y-[50%]"
          onClick={() => {
            setQuery(null);
          }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
