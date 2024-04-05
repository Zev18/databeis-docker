"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiUrlClient } from "@/lib/consts";
import { Category } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import CategoriesList from "./CategoriesList";
import CreateCategory from "./CreateCategory";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesTab({
  categories: c,
}: {
  categories: Category[];
}) {
  const { data: categories } = useCategories(c);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Create and manage categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateCategory />
        <CategoriesList />
      </CardContent>
    </Card>
  );
}
