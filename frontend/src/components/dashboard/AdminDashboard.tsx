"use client";

import { capitalize } from "@/lib/utils";
import { BarChart3, BookText, Group, Users } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SfarimTab from "./SfarimTab";

const iconSize = 22;

const tabsList = [
  {
    name: "sfarim",
    icon: <BookText size={iconSize} />,
    component: <SfarimTab />,
  },
  {
    name: "categories",
    icon: <Group size={iconSize} />,
    component: <SfarimTab />,
  },
  {
    name: "users",
    icon: <Users size={iconSize} />,
    component: <SfarimTab />,
  },
  {
    name: "stats",
    icon: <BarChart3 size={iconSize} />,
    component: <SfarimTab />,
  },
];

export default function AdminDashboard() {
  const [tab, setTab] = useQueryState("tab");

  const isSelected = (tabName: string) => {
    if (!tab && tabName === tabsList[0].name) {
      return true;
    } else {
      return tabName === tab;
    }
  };

  return (
    <>
      <div className="w-full sm:hidden">
        <Tabs value={tab || tabsList[0].name} onValueChange={setTab}>
          <TabsList>
            {tabsList.map((tabData) => (
              <TabsTrigger value={tabData.name} key={tabData.name}>
                {capitalize(tabData.name)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabsList.map((tabData) => (
            <TabsContent value={tabData.name} key={tabData.name}>
              {tabData.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="relative hidden max-h-full w-full gap-6 sm:flex">
        <aside className="sticky top-16 z-20 flex h-[calc(100vh-5rem)] w-full max-w-[10rem] flex-col gap-4 py-4 lg:max-w-[14rem]">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          {tabsList.map((tab) => (
            <Button
              className="w-full justify-start"
              key={tab.name}
              onClick={() => setTab(tab.name)}
              variant={isSelected(tab.name) ? "default" : "ghost"}
            >
              {tab.icon}
              <p className="ml-2 text-lg">{capitalize(tab.name)}</p>
            </Button>
          ))}
        </aside>
        <div className="mb-[20vh] py-4">
          {tabsList.find((tabData) => tabData.name == tab)?.component ||
            tabsList[0].component}
        </div>
      </div>
    </>
  );
}
