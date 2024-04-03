import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CreateCategory from "./CreateCategory";
import { Category } from "@/lib/types";
import CategoriesList from "./CategoriesList";

export default function CategoriesTab({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Create and manage categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateCategory categories={categories} />
        <CategoriesList categories={categories} />
      </CardContent>
    </Card>
  );
}
