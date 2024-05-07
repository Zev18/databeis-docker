import { apiUrlServer } from "@/lib/consts";
import { headers } from "next/headers";
import React from "react";
import SavedSfarim from "./SavedSfarim";
import { trimStrings } from "@/lib/utils";
import { redirect } from "next/navigation";

const fetchInitialSfarim = async () => {
  const userRes = await fetch(apiUrlServer + "/api/authenticate", {
    credentials: "include",
    headers: headers(),
  });
  const user = await userRes.json();

  if (!user.isAdmin) {
    redirect("/login");
  }

  const res = await fetch(apiUrlServer + "/api/sfarim/saved/", {
    headers: headers(),
    credentials: "include",
  });
  return res.json();
};

export default async function ReadingList() {
  const initialSfarim = trimStrings(await fetchInitialSfarim());

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <SavedSfarim initialSfarim={initialSfarim} />
    </div>
  );
}
