"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { apiUrlClient } from "@/lib/consts";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export default function PrivacySettings() {
  const { user } = useAuthStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-lg">Public Profile</p>
            <p className="text-foreground/60">
              Make your saved books publicly visible
            </p>
          </div>
          <div>
            {user && (
              <Switch
                checked={!user?.isHidden}
                onCheckedChange={() => {
                  const hidden = !user?.isHidden;
                  useAuthStore.setState({
                    user: { ...user!, isHidden: hidden },
                  });
                  fetch(`${apiUrlClient}/api/users/toggle-hidden`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ isHidden: hidden }),
                  });
                }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
