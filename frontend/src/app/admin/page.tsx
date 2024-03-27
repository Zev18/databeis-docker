import AdminDashboard from "@/components/dashboard/AdminDashboard";
import React from "react";

export default function Admin() {
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
