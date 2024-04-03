import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SfarimTab from "@/components/dashboard/SfarimTab";
import CategoriesTab from "@/components/dashboard/categories/CategoriesTab";
import { apiUrlServer } from "@/lib/consts";
import { BookText, Group, Users, BarChart3 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const iconSize = 22;

const fetchCategories = async () => {
  const res = await fetch(apiUrlServer + "/api/categories", {
    headers: headers(),
  });
  const data = await res.json();
  return data;
};

export default async function Admin() {
  const res = await fetch(apiUrlServer + "/api/authenticate", {
    credentials: "include",
    headers: headers(),
  });
  const user = await res.json();

  if (!user.isAdmin) {
    redirect("/login");
  }

  const categories = await fetchCategories();

  const tabsList = [
    {
      name: "sfarim",
      icon: <BookText size={iconSize} />,
      component: <SfarimTab />,
    },
    {
      name: "categories",
      icon: <Group size={iconSize} />,
      component: <CategoriesTab categories={categories} />,
    },
    {
      name: "users",
      icon: <Users size={iconSize} />,
      component: <SfarimTab />,
    },
    {
      name: "stats",
      icon: <BarChart3 size={iconSize} />,
      component: <SfarimTab />,
    },
  ];

  return (
    <div className="mb-4 flex w-full justify-center">
      <div className="flex w-full flex-col items-center gap-4 px-4">
        <h2 className="mt-4 w-full text-2xl font-bold sm:hidden">
          Admin Dashboard
        </h2>
        <AdminDashboard tabsList={tabsList} />
      </div>
    </div>
  );
}
