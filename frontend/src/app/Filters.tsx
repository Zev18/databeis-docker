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
import { Group } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import CategoryListing from "./CategoryListing";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  return (
    <>
      <div className="flex sm:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Group size={iconSize} />
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
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="hidden sm:flex">Filters</div>
    </>
  );
}
