import { headers } from "next/headers";
import FileForm from "./FileForm";
import { apiUrlServer } from "@/lib/consts";
import { redirect } from "next/navigation";

export default async function Upload() {
  const res = await fetch(apiUrlServer + "/api/authenticate", {
    credentials: "include",
    headers: headers(),
  });
  const user = await res.json();

  if (!user.isAdmin) {
    redirect("/login");
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <FileForm />
    </div>
  );
}
