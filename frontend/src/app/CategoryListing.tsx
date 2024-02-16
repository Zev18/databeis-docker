"use client";

export default function CategoryListing({
  category,
}: {
  category: Record<string, any>;
}) {
  return (
    <div>
      <h3 className="text-xl">{category.name}</h3>
    </div>
  );
}
