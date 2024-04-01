import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { apiUrlServer } from "@/lib/consts";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Admin() {
  const res = await fetch(apiUrlServer + "/api/authenticate", {
    credentials: "include",
    headers: headers(),
  });
  const user = await res.json();

  if (!user.isAdmin) {
    redirect("/login");
  }

  return (
    <div className="mb-4 flex w-full justify-center">
      <div className="flex w-full flex-col items-center gap-4 px-4">
        <h2 className="mt-4 w-full text-2xl font-bold sm:hidden">
          Admin Dashboard
        </h2>
        <AdminDashboard />
      </div>
    </div>
  );
}
