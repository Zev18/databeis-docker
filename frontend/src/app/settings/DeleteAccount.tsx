import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function DeleteAccount() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/60">
          If, for some reason, you want to delete your account, you can do so
          here.
        </p>
      </CardContent>
    </Card>
  );
}
