import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/lib/types";
import CategoryItem from "./CategoryItem";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesList() {
  const { data: categories } = useCategories();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Edit Categories</h3>
      <ScrollArea className="h-[400px]  rounded-md border shadow-inner">
        <div className="flex flex-col divide-y">
          {categories?.map((category: Category) => (
            <CategoryItem category={category} key={category.id} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
