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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toggle } from "@/components/ui/toggle";
import { delimiter, languages } from "@/lib/consts";
import { capitalize } from "@/lib/utils";
import { Group, Languages, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import CategoryListing from "./CategoryListing";

const iconSize = 18;

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
  const [numLanguages, setNumLanguages] = useState(
    selectedLanguage?.split(delimiter)?.length || 0,
  );

  const toggleLanguage = (lang: string) => {
    if (!selectedLanguage) {
      setSelectedLanguage(lang);
    } else {
      const splitLangs = selectedLanguage.split(delimiter);
      if (splitLangs.includes(lang)) {
        const newLangs = splitLangs.filter((c) => c !== lang).join(delimiter);
        setSelectedLanguage(newLangs.length > 0 ? newLangs : null);
      } else {
        setSelectedLanguage([...splitLangs, lang].join(delimiter));
      }
    }
  };

  const containsLang = (lang: string) => {
    if (!selectedLanguage) return false;
    return selectedLanguage.split(delimiter).includes(lang);
  };

  useEffect(() => {
    setNumCategories(selectedCategories?.split(delimiter)?.length || 0);
    setNumLanguages(selectedLanguage?.split(delimiter)?.length || 0);
  }, [setNumCategories, selectedCategories, setNumLanguages, selectedLanguage]);

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
              {categories &&
                categories.map((category) => (
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <Languages size={iconSize} />
            {numLanguages > 0 ? (
              <span className="ml-2">{numLanguages} selected</span>
            ) : (
              <span className="ml-2">Languages</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Languages</DialogTitle>
          </DialogHeader>
          <div className="my-4 flex gap-2">
            {languages.map((language) => (
              <Toggle
                variant="outline"
                key={language}
                value={language}
                defaultPressed={containsLang(language)}
                pressed={containsLang(language)}
                onPressedChange={() => toggleLanguage(language)}
              >
                <p className="text-xl">{capitalize(language)}</p>
              </Toggle>
            ))}
          </div>
          <DialogFooter className="w-full flex-row justify-stretch space-x-2">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setSelectedLanguage(null)}
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
