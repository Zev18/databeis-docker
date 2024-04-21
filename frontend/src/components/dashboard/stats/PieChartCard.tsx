"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalize, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { BaseDataEntry } from "react-minimal-pie-chart/types/commonTypes";

export default function PieChartCard({
  data,
  total,
  title,
}: {
  data: BaseDataEntry[];
  total: number;
  title: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    console.log(hovered);
  }, [hovered]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Popover open={hovered !== null}>
          <PopoverTrigger>
            <PieChart
              data={data}
              onMouseOver={(_, index) => {
                setHovered(index);
              }}
              onMouseOut={() => {
                setHovered(null);
              }}
              onBlur={() => {
                setHovered(null);
              }}
            />
          </PopoverTrigger>
          <PopoverContent side="bottom" sideOffset={-40} className="w-fit py-2">
            {hovered !== null && (
              <div className="pointer-events-none flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: data[hovered].color }}
                />
                <p>{capitalize(data[hovered].title?.toString() || "")}</p>
                <p>{data[hovered].value}</p>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
