import { apiUrlServer } from "@/lib/consts";
import { headers } from "next/headers";
import React from "react";
import SavedSfarim from "./SavedSfarim";
import { trimStrings } from "@/lib/utils";

const fetchInitialSfarim = async () => {
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
