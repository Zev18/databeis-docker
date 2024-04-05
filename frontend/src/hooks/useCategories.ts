import { apiUrlClient } from "@/lib/consts";
import { Category } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useCategories(initial?: Category[]) {
  const categories = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await fetch(apiUrlClient + "/api/categories");
      const categories = await data.json();
      return categories;
    },
    initialData: initial,
  });

  const allCategories = getAllCategories(categories.data || []);

  return { ...categories, allCategories };
}

const getAllCategories = (c: Category[], result: Category[] = []) => {
  for (const category of c) {
    result.push(category);
    if (category.children) {
      getAllCategories(category.children, result);
    }
  }
  return result;
};
