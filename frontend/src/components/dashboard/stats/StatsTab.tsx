import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiUrlClient } from "@/lib/consts";
import React from "react";

const fetchStats = async () => {
  const categories = await (
    await fetch(apiUrlClient + "/api/categories")
  ).json();
};

export default async function StatsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
        <CardDescription>View stats about the sfarim and users</CardDescription>
      </CardHeader>
    </Card>
  );
}
