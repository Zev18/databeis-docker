import React from "react";
import UserCard from "./UserCard";
import { redirect } from "next/navigation";
import { apiUrlServer } from "@/lib/consts";
import { headers } from "next/headers";

export default async function Profile() {
  console.log(
    await fetch(apiUrlServer + "/api/authenticate", {
      credentials: "include",
      headers: headers(),
    }),
  );
  const loggedIn = (
    await fetch(apiUrlServer + "/api/authenticate", {
      credentials: "include",
      headers: headers(),
    })
  ).ok;

  if (!loggedIn) {
    redirect("/login");
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <h2 className="w-full text-2xl font-bold">My profile</h2>
      <UserCard />
    </div>
  );
}
