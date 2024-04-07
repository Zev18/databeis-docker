"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/lib/types";
import { capitalize, cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import EditCategoryForm from "./EditCategoryForm";

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
      <div className="flex w-full items-center gap-2 px-2 py-2 hover:bg-secondary">
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
        <div className="ml-auto mr-2 flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Pencil size={iconSize} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit category</DialogTitle>
                <DialogDescription>
                  Change the name or parent category. These changes will apply
                  to all sfarim with this category.
                </DialogDescription>
                <EditCategoryForm category={category} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Trash2 size={iconSize} />
          </Button>
        </div>
      </div>
      {childrenOpen &&
        category.children?.map((child) => (
          <CategoryItem key={child.id} category={child} indent={indent + 1} />
        ))}
    </>
  );
}
