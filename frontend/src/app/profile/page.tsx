import { apiUrlServer } from "@/lib/consts";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileSection from "./ProfileSection";

const fetchAffiliations = async () => {
  const url = new URL(apiUrlServer + "/api/affiliations?order=name");
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};

export default async function Profile() {
  const loggedIn = (
    await fetch(apiUrlServer + "/api/authenticate", {
      credentials: "include",
      headers: headers(),
    })
  ).ok;

  if (!loggedIn) {
    redirect("/login");
  }

  const affiliations = await fetchAffiliations();

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 p-4">
        <h2 className="w-full text-3xl font-bold">My profile</h2>
        <ProfileSection affiliations={affiliations} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Profile | Databeis",
};
