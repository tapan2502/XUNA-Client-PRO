import React from "react";
import {
  Card,
  Chip,
} from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Icon } from "@iconify/react";

interface KpiStatsCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  change: string;
  color: "success" | "warning" | "danger" | "primary" | "secondary" | "default";
  data: { value: number }[];
}

export default function KpiStatsCard({
  title,
  value,
  change,
  color,
  data,
}: KpiStatsCardProps) {
  const gradientId = React.useId();

  const getChartColor = (colorName: typeof color): string => {
    const colorMap = {
      success: "#17c964",
      primary: "#006FEE",
      secondary: "#9353d3",
      warning: "#f5a524",
      danger: "#f31260",
      default: "#71717a",
    };
    return colorMap[colorName] || colorMap.default;
  };

  const chartColor = getChartColor(color);

  return (
      className="bg-white dark:bg-default-50/5 border border-default-200 shadow-sm rounded-none p-6 flex flex-col justify-start relative overflow-hidden h-[178px]"
    >
      <div className="flex justify-between items-start z-10 w-full mb-2">
        <div className="flex flex-col gap-1">
          <dt className="text-default-400 text-[13px] font-medium leading-none">{title}</dt>
          <dd className="text-foreground text-4xl font-bold tracking-tight mt-2">{value}</dd>
        </div>
        <Chip
          className="capitalize h-6 px-2.5 text-[11px] font-bold border-none"
          color={color}
          size="sm"
          variant="flat"
          startContent={<Icon icon={color === "success" ? "solar:arrow-right-up-linear" : color === "danger" ? "solar:arrow-right-down-linear" : "solar:arrow-right-linear"} width={14} />}
        >
          {change}
        </Chip>
      </div>

      {/* Sparkline Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-[65px] w-full translate-y-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={chartColor} 
                  stopOpacity={0.15} 
                />
                <stop 
                  offset="95%" 
                  stopColor={chartColor} 
                  stopOpacity={0} 
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
