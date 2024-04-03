"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Category } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const iconSize = 18;

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  parentId: z.coerce.number().optional(),
});

export default function CreateCategory({
  categories,
}: {
  categories: Category[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const allCategories = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => {
      map.set(category.id, category);
      if (category.children) {
        category.children.forEach((child) => {
          map.set(child.id, child);
        });
      }
    });
    return map;
  }, [categories]);

  const [parentCategory, setParentCategory] = useState<Category>();

  const renderCategories = useCallback((category: Category) => {
    const options = [
      <SelectItem key={category.id} value={category.id.toString()}>
        {capitalize(category.name)}
      </SelectItem>,
    ];
    if (category.children) {
      category.children.forEach((child) => {
        options.push(
          <div key={child.id} className="px-4">
            <SelectItem value={child.id.toString()}>
              {capitalize(child.name)}
            </SelectItem>
          </div>,
        );
      });
    }
    return options;
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild className="max-w-fit">
        <Button variant="outline" size="lg">
          <Plus size={iconSize} className="mr-2" />
          New Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <FormDescription>
                    If you want this category to be a subcategory or a
                    subsubcategory, select which category should be its parent.
                  </FormDescription>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(id) => {
                        field.onChange(id);
                        setParentCategory(allCategories.get(Number(id)));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {parentCategory
                            ? capitalize(parentCategory.name)
                            : "No parent"}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) =>
                          renderCategories(category),
                        )}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          form.setValue("parentId", undefined);
                          setParentCategory(undefined);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
