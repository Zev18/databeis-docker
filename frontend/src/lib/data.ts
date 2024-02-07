import { Bookmark, CircleUser, Settings } from "lucide-react";
import { PageInfo } from "./types";

export const menuPages = [
  {
    name: "Profile",
    path: "/profile",
    icon: CircleUser,
  },
  {
    name: "Reading list",
    path: "/reading-list",
    icon: Bookmark,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
