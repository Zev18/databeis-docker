"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiUrlClient, languages } from "@/lib/consts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { capitalize, cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const iconSize = 20;

const seferSchema = z.object({
  confirmed: z.boolean().optional(),
  shelfSection: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const firstChar = parseInt(value[0]);
        return !isNaN(firstChar);
      },
      {
        message: "First character must be an integer.",
      },
    ),
  title: z.string().min(1, "Title is required."),
  hebrewTitle: z.string().optional(),
  masechetSection: z.string().optional(),
  volume: z.string().optional(),
  languages: z.set(z.string()).optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  categoryId: z.coerce.number().optional(),
  subcategoryId: z.coerce.number().optional(),
  subsubcategoryId: z.coerce.number().optional(),
});

const fetchCategories = async () => {
  const data = await fetch(apiUrlClient + "/api/categories");
  const categories = await data.json();
  return categories;
};

export default function EditForm() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [visibleFields, setVisibleFields] = useState(new Set<string>());
  const [selCategory, setSelCategory] = useState<Record<string, any>>();
  const [selSubcategory, setSelSubcategory] = useState<Record<string, any>>();
  const [selSubsubcategory, setSelSubsubcategory] =
    useState<Record<string, any>>();
  const [selectingCategory, setSelectingCategory] = useState(false);

  const form = useForm<z.infer<typeof seferSchema>>({
    resolver: zodResolver(seferSchema),
    defaultValues: {
      confirmed: true,
      quantity: 0,
      languages: new Set<string>(),
    },
  });

  const submission = useMutation({
    mutationFn: (values: z.infer<typeof seferSchema>) => {
      const data = {
        confirmed: values.confirmed,
        shelfSection: values.shelfSection,
        title: values.title,
        hebrewTitle: values.hebrewTitle,
        masechetSection: values.masechetSection,
        volume: values.volume,
        language: stringifySet(values.languages),
        quantity: values.quantity,
        categoryId: values.categoryId,
        subcategoryId: values.subcategoryId,
        subsubcategoryId: values.subsubcategoryId,
      };

      const requestOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      };

      return fetch(apiUrlClient + "/api/sfarim", requestOptions);
    },
    onSuccess: (data) => {
      toast.success("Sefer created");
    },
    onError: (error) => {
      toast.error("Error creating sefer", {
        description: error.message,
      });
    },
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = async (values: z.infer<typeof seferSchema>) => {
    submission.mutate(values);
  };

  useEffect(() => {
    console.log(selCategory);
  }, [selCategory]);
  useEffect(() => {
    console.log(selSubcategory);
  }, [selSubcategory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Sefer</CardTitle>
        <CardDescription>
          To edit or delete a sefer, search and select one from the homepage and
          then click &quot;edit&quot; or &quot;delete.&quot; The only required
          field is the title.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="confirmed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Confirmed</FormLabel>
                    <FormDescription>
                      Uncheck this if the book isn&apos;t confirmed to be in the
                      beis.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sefer Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {visibleFields.has("hebrewTitle") ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    visibleFields.delete("hebrewTitle");
                    form.setValue("hebrewTitle", "");
                  }}
                >
                  <X size={iconSize} />
                </Button>
                <FormField
                  control={form.control}
                  name="hebrewTitle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Hebrew Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => visibleFields.add("hebrewTitle")}
              >
                <PlusCircle size={iconSize} className="mr-2" />
                Add Hebrew Title
              </Button>
            )}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shelfSection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf</FormLabel>
                  <FormDescription>
                    Include the shelf number and the section. Example: 1a
                  </FormDescription>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="masechetSection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masechet / Section</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {visibleFields.has("volume") ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    visibleFields.delete("volume");
                    form.setValue("volume", "");
                  }}
                >
                  <X size={iconSize} />
                </Button>
                <FormField
                  control={form.control}
                  name="volume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => visibleFields.add("volume")}
              >
                <PlusCircle size={iconSize} className="mr-2" />
                Add Volume
              </Button>
            )}
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormDescription>
                    Select all languages that are used in this text.
                  </FormDescription>
                  <div className="my-4 flex gap-2">
                    {languages.map((language) => (
                      <Toggle
                        size="lg"
                        variant="outline"
                        key={language}
                        value={language}
                        pressed={field.value?.has(language)}
                        onPressedChange={(pressed) => {
                          const updatedValue = new Set(field.value);
                          if (pressed) {
                            updatedValue.add(language);
                          } else {
                            updatedValue.delete(language);
                          }
                          field.onChange(updatedValue);
                        }}
                      >
                        <p>{capitalize(language)}</p>
                      </Toggle>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <div className="flex w-full gap-2">
                    <Popover
                      open={selectingCategory}
                      onOpenChange={setSelectingCategory}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between gap-4",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? categories.find(
                                  (category: Record<string, any>) =>
                                    category.id == field.value,
                                )?.id
                              : "Select category"}
                            <ChevronsUpDown size={iconSize} />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search categories..." />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {categories?.map(
                                (category: Record<string, any>) => (
                                  <CommandItem
                                    value={capitalize(category.name)}
                                    key={category.id}
                                    onSelect={() => {
                                      form.setValue("categoryId", category.id);
                                      setSelCategory(category);
                                      setSelSubcategory(undefined);
                                      setSelSubsubcategory(undefined);
                                      setSelectingCategory(false);
                                    }}
                                  >
                                    <Check
                                      size={iconSize}
                                      className={cn(
                                        "mr-2 h-2 w-4",
                                        category.id == field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {capitalize(category.name)}
                                  </CommandItem>
                                ),
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {field.value && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          form.setValue("categoryId", undefined);
                          setSelCategory(undefined);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selCategory && selCategory.children && (
              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <div className="flex w-full gap-2">
                      <Select
                        onValueChange={(id) => {
                          field.onChange(id);
                          setSelSubcategory(
                            selCategory.children.find(
                              (category: Record<string, any>) =>
                                category.id == id,
                            ),
                          );
                          setSelSubsubcategory(undefined);
                        }}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue>
                              {selSubcategory
                                ? capitalize(selSubcategory.name)
                                : "Select a subcategory..."}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selCategory.children.map(
                            (category: Record<string, any>) => (
                              <SelectItem key={category.id} value={category.id}>
                                {capitalize(category.name)}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      {selSubcategory && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            form.setValue("subcategoryId", undefined);
                            setSelSubcategory(undefined);
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            )}
            {selSubcategory && selSubcategory.children && (
              <FormField
                control={form.control}
                name="subsubcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subsubcategory</FormLabel>
                    <div className="flex w-full gap-2">
                      <Select
                        onValueChange={(id) => {
                          field.onChange(id);
                          setSelSubsubcategory(
                            selSubcategory.children.find(
                              (category: Record<string, any>) =>
                                category.id == id,
                            ),
                          );
                        }}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue>
                              {selSubsubcategory
                                ? capitalize(selSubsubcategory?.name)
                                : "Select a subsubcategory..."}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selSubcategory.children.map(
                            (category: Record<string, any>) => (
                              <SelectItem key={category.id} value={category.id}>
                                {capitalize(category.name)}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      {selSubsubcategory && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            form.setValue("subsubcategoryId", undefined);
                            setSelSubsubcategory(undefined);
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            )}
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const stringifySet = (s: Set<string> | undefined) => {
  if (!s) return "";
  let result = "";
  s.forEach((value, _, set) => {
    result += value;
    if (set.size > 1 && value !== Array.from(set)[set.size - 1]) {
      result += "/";
    }
  });
  return result;
};
