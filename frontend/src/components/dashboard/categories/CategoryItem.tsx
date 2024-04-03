"use client";

import { Category } from "@/lib/types";
import { capitalize, cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const iconSize = 20;

export default function CategoryItem({
  category,
  indent = 0,
}: {
  category: Category;
  indent?: number;
}) {
  const [childrenOpen, setChildrenOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 px-2 py-2 hover:bg-secondary">
        <button
          onClick={() => setChildrenOpen(!childrenOpen)}
          className={cn(
            !category.children && "pointer-events-none opacity-0",
            indent == 1 && "pl-4",
            indent == 2 && "pl-8",
          )}
        >
          {childrenOpen ? (
            <ChevronDown size={iconSize} />
          ) : (
            <ChevronRight size={iconSize} />
          )}
        </button>
        <p>{capitalize(category.name)}</p>
        <div className="self-justify-end"></div>
      </div>
      {childrenOpen &&
        category.children?.map((child) => (
          <CategoryItem key={child.id} category={child} indent={indent + 1} />
        ))}
    </>
  );
}
