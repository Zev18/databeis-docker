"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalize, cn } from "@/lib/utils";
import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { BaseDataEntry } from "react-minimal-pie-chart/types/commonTypes";

export default function PieChartCard({
  data,
  total,
}: {
  data: BaseDataEntry[];
  total: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Popover
            open={hovered !== null}
            onOpenChange={() => setHovered(null)}
          >
            <PieChart
              data={data}
              onMouseOver={(_, index) => {
                setHovered(index);
              }}
              onClick={(_, index) => {
                setHovered(index);
              }}
              onMouseOut={() => {
                setHovered(null);
              }}
              onBlur={() => {
                setHovered(null);
              }}
            />
            <PopoverContent side="bottom" sideOffset={-40}>
              <div>
                {hovered !== null && (
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: data[hovered].color }}
                    />
                    <p>{capitalize(data[hovered].title?.toString() || "")}</p>
                    <p>{data[hovered].value}</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
