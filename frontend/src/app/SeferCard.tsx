import LanguageIcon from "@/components/LanguageIcon";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function SeferCard({ sefer }: { sefer: Record<string, any> }) {
  return (
    <Card>
      <div className="p-2 px-3">
        <div className="flex flex-wrap gap-2 items-center">
          <h2 className="text-lg">{sefer.title}</h2>
          <p className="text-foreground/60">{sefer.masechetSection}</p>
          <LanguageIcon languages={sefer.language} />
        </div>
      </div>
    </Card>
  );
}
