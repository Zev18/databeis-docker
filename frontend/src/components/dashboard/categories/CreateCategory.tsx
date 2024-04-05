"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useCategories } from "@/hooks/useCategories";
import { apiUrlClient } from "@/lib/consts";
import { Category } from "@/lib/types";
import { capitalize, cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const iconSize = 18;

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  parentId: z.coerce.number().optional(),
});

export default function CreateCategory() {
  const { data: categories, allCategories } = useCategories();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: (data: { name: string; type: string; parentId?: number }) => {
      return fetch(apiUrlClient + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
    },
    onError: (error) => {
      console.log("Error: " + error.message);
      toast.error("Error creating category", { description: error.message });
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (!data.ok) {
        const res = await data.json();
        toast.error("Error creating category", {
          description: capitalize(res.message),
        });
      } else {
        toast.success("Category created");
        setOpen(false);
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const parentType = values.parentId
      ? allCategories.find((c) => c.id === values.parentId)?.type
      : "category";
    const body = {
      ...values,
      type: parentType
        ? parentType === "category"
          ? "subcategory"
          : "subsubcategory"
        : "category",
    };
    createCategory(body);
  };

  const categoriesMap = useMemo(() => {
    const map = new Map();
    categories?.forEach((category) => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="lg"
        className="max-w-fit"
        onClick={() => setOpen(true)}
      >
        <Plus size={iconSize} className="mr-2" />
        New Category
      </Button>
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
                    <Input {...field} value={field.value || ""} />
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
                        setParentCategory(categoriesMap.get(Number(id)));
                      }}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {parentCategory
                            ? capitalize(parentCategory.name)
                            : "No parent"}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allCategories?.map(
                          (category) =>
                            category.type !== "subsubcategory" && (
                              <div
                                key={category.id}
                                className={cn(
                                  category.type !== "category" && "px-4",
                                )}
                              >
                                <SelectItem value={category.id.toString()}>
                                  {capitalize(category.name)}
                                </SelectItem>
                              </div>
                            ),
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
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
