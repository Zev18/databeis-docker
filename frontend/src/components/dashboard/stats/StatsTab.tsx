import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiUrlServer } from "@/lib/consts";
import { BookCopy, Bookmark, Shield, Users } from "lucide-react";
import SmallStat from "./SmallStat";
import { Category } from "@/lib/types";
import PieChartCard from "./PieChartCard";
import { capitalize, randomColor } from "@/lib/utils";
import { BaseDataEntry } from "react-minimal-pie-chart/types/commonTypes";

export const revalidate = 60;

const fetchCategories = async () => {
  const categories = await (
    await fetch(apiUrlServer + "/api/categories")
  ).json();
  return categories;
};

const fetchStats = async () => {
  const data = await fetch(apiUrlServer + "/api/stats");
  const stats = await data.json();
  return stats;
};

export default async function StatsTab() {
  const categories = await fetchCategories();
  const stats = await fetchStats();

  const data = generateData(categories, stats);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
        <CardDescription>View stats about the sfarim and users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <SmallStat
            title="Total users"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          >
            {String(stats.totalUsers).padStart(4, "0")}
          </SmallStat>
          <SmallStat
            title="Admins"
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          >
            {String(stats.totalAdmins).padStart(4, "0")}
          </SmallStat>
          <SmallStat
            title="Sfarim"
            icon={<BookCopy className="h-4 w-4 text-muted-foreground" />}
          >
            {String(stats.totalSfarim).padStart(4, "0")}
          </SmallStat>
          <SmallStat
            title="Saved sfarim"
            icon={<Bookmark className="h-4 w-4 text-muted-foreground" />}
          >
            {String(stats.totalSaved).padStart(4, "0")}
          </SmallStat>
        </div>
        <div className="grid">
          <PieChartCard data={data.categoryData} total={stats.totalSfarim} />
        </div>
      </CardContent>
    </Card>
  );
}

const generateData = (categories: Category[], stats: Record<string, any>) => {
  const categoryData: BaseDataEntry[] = [];

  for (const category of categories) {
    const entry: BaseDataEntry = {
      title: capitalize(category.name),
      value: stats.categoryStats[category.id].count,
      color: randomColor(),
    };
    categoryData.push(entry);
  }

  return { categoryData };
};
