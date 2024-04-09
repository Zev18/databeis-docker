import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SfarimTab from "@/components/dashboard/SfarimTab";
import CategoriesTab from "@/components/dashboard/categories/CategoriesTab";
import UsersTab from "@/components/dashboard/users/UsersTab";
import { apiUrlServer } from "@/lib/consts";
import { User } from "@/lib/types";
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

const fetchAdmins = async () => {
  const res = await fetch(apiUrlServer + "/api/users/admins", {
    headers: headers(),
  });
  const data = await res.json();
  const users = [];
  for (const admin of data) {
    const user: User = {
      id: admin.ID,
      name: admin.displayName || admin.name,
      email: admin.email,
      isAdmin: admin.isAdmin,
      avatarUrl: admin.customAvatarUrl || admin.avatarUrl,
    };
    if (admin.affiliation) {
      user.affiliation = data.affiliation.name;
    }
    if (admin.gradYear) {
      user.gradYear = data.gradYear;
    }
    users.push(user);
  }
  return users;
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

  const admins = await fetchAdmins();

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
      component: <UsersTab users={admins} />,
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
