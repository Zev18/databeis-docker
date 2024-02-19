"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Group, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import CategoryListing from "./CategoryListing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { delimiter } from "@/lib/consts";

const iconSize = 18;

const languages = ["english", "hebrew", "aramaic"];

export default function Filters({
  categories = [],
}: {
  categories: Record<string, any>[];
}) {
  const [selectedLanguage, setSelectedLanguage] = useQueryState("language");
  const [selectedCategories, setSelectedCategories] =
    useQueryState("categories");
  useQueryState("categories");
  const [numCategories, setNumCategories] = useState(
    selectedCategories?.split(delimiter)?.length || 0,
  );

  useEffect(() => {
    setNumCategories(selectedCategories?.split(delimiter)?.length || 0);
  }, [setNumCategories, selectedCategories]);

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <Group size={iconSize} />
            {numCategories > 0 ? (
              <span className="ml-2">{numCategories} selected</span>
            ) : (
              <span className="ml-2">Categories</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Categories</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <CategoryListing key={category.id} category={category} />
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="w-full flex-row justify-stretch space-x-2">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setSelectedCategories(null)}
            >
              <X size={iconSize} className="mr-2" />
              Clear all
            </Button>
            <DialogClose asChild>
              <Button className="w-full sm:w-auto">Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
