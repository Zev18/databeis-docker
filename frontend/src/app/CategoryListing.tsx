"use client";

import { delimiter } from "@/lib/consts";
import { capitalize, cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

export default function CategoryListing({
  category,
  level = 0,
}: {
  category: Record<string, any>;
  level?: number;
}) {
  const [categories, setCategories] = useQueryState("categories");
  const [open, setOpen] = useState(
    childIsSelected(category, categories?.split(delimiter) ?? []),
  );

  const toggleCategory = (id: number) => {
    if (!categories) {
      setCategories(id.toString());
    } else {
      const splitCategories = categories.split(delimiter);
      if (categories.includes(id.toString())) {
        const newCategories = splitCategories
          .filter((c) => c !== id.toString())
          .join(delimiter);
        setCategories(newCategories.length > 0 ? newCategories : null);
      } else {
        setCategories([...splitCategories, id.toString()].join(delimiter));
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-[2rem_1fr] items-center gap-2",
          level == 1 && "ml-4",
          level == 2 && "ml-8",
        )}
      >
        {category.children ? (
          <button onClick={() => setOpen((prev) => !prev)}>
            <ChevronRight
              className={cn("transition-all duration-150", open && "rotate-90")}
            />
          </button>
        ) : (
          <div />
        )}
        <div className="flex flex-col gap-2">
          <button
            className="flex justify-start"
            onClick={() => toggleCategory(category.id)}
          >
            <h3
              className={cn(
                "text-left text-xl",
                categories?.includes(category.id)
                  ? "font-bold underline underline-offset-2"
                  : "text-foreground/60",
              )}
            >
              {capitalize(category.name)}
            </h3>
          </button>
        </div>
      </div>
      {open &&
        category.children &&
        category.children.map((subcategory: Record<string, any>) => (
          <CategoryListing
            key={subcategory.id}
            category={subcategory}
            level={level + 1}
          />
        ))}
    </>
  );
}

function childIsSelected(category: Record<string, any>, ids: string[]) {
  if (ids.includes(category.id.toString())) {
    return true;
  }

  if (category.children && category.children.length > 0) {
    for (const childCategory of category.children) {
      if (childIsSelected(childCategory, ids)) {
        return true;
      }
    }
  }

  return false;
}
