"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Languages } from "lucide-react";
import React, { useEffect } from "react";

export default function LanguageIcon({ languages }: { languages: string }) {
  const colors = getColor(languages);
  const strings = getString(languages);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className="p-1 px-2 text-sm rounded-lg flex items-center gap-1"
            style={{
              backgroundColor: colors.secondary,
              color: colors.primary,
            }}>
            <Languages size={16} />
            <span>{strings.icon}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{strings.sentence}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const getColor = (
  languages: string
): { primary: string; secondary: string } => {
  if (languages.includes("english"))
    return { primary: "#548cc4", secondary: "#c7e5f6" };
  else if (languages.includes("hebrew"))
    return { primary: "#B58AF6", secondary: "#efd5ff" };
  else return { primary: "#d1716a", secondary: "#F7C1BD" };
};

const getString = (languages: string): { icon: string; sentence: string } => {
  const l: string[] = [];
  const langs: string[] = [];
  let sentence = "This work contains ";
  let finalString = "";
  if (languages.includes("english")) {
    l.push("en");
    langs.push("English");
  }
  if (languages.includes("hebrew")) {
    l.push("ע");
    langs.push("Hebrew");
  }
  if (languages.includes("aramaic")) {
    l.push("א");
    langs.push("Aramaic");
  }
  l.forEach((lang, i) => {
    finalString += lang;
    sentence += langs[i];
    if (i < l.length - 1) {
      finalString += "/";
      sentence += langs.length > 2 ? ", " : " ";
      if (i === l.length - 2) {
        sentence += "and ";
      }
    }
  });
  sentence += " text.";
  return { icon: finalString, sentence: sentence };
};
