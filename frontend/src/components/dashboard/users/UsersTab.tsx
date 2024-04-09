"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdmins } from "@/hooks/useAdmins";
import { User } from "@/lib/types";
import React from "react";

export default function UsersTab({ users }: { users: User[] }) {
  const { data: admins } = useAdmins(users);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage users and admin permissions</CardDescription>
        <h2>Admins</h2>
      </CardHeader>
    </Card>
  );
}
