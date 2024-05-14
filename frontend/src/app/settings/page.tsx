import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrlServer } from "@/lib/consts";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import ThemeSettings from "./ThemeSettings";
import DeleteAccount from "./DeleteAccount";
import PrivacySettings from "./PrivacySettings";

export default async function Settings() {
  const loggedIn = await fetch(apiUrlServer + "/api/authenticate", {
    credentials: "include",
    headers: headers(),
  });

  if (!loggedIn.ok) {
    redirect("/login");
  }

  const user = await loggedIn.json();

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 p-4">
        <h2 className="w-full text-3xl font-bold">Settings</h2>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="w-full text-foreground/60">
            To change your profile information such as your name, visit the{" "}
            <Link
              href="/profile"
              className="text-primary underline-offset-4 hover:underline"
            >
              profile
            </Link>{" "}
            page.
          </CardContent>
        </Card>
        <ThemeSettings />
        <PrivacySettings initial={!user.isHidden} />
        <DeleteAccount />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Settings | Databeis",
};
