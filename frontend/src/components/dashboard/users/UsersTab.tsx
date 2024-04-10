"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdmins } from "@/hooks/useAdmins";
import { User } from "@/lib/types";
import React from "react";
import AdminListing from "./AdminListing";
import SearchUser from "./SearchUser";

export default function UsersTab({ users }: { users: User[] }) {
  const { data: admins } = useAdmins(users);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage users and admin permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Admins</h2>
          <div className="rounded-xl border p-2">
            {admins?.map((admin: User, index) => (
              <AdminListing user={admin} key={admin.id} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Appoint new admin</h2>
          <p className="text-foreground/60">Grant admin privileges to a user</p>
          <SearchUser />
        </div>
      </CardContent>
    </Card>
  );
}
