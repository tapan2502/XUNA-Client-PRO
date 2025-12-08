
import React from "react";
import { Card, Chip, cn } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { Icon } from "@iconify/react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  chartColor: "success" | "warning" | "danger"; // Restrict to specific themes
  data: number[];
}

export default function MetricCard({
  title,
  value,
  change,
  chartColor,
  data,
}: MetricCardProps) {
  // Map simple number array to object array for Recharts
  const chartData = data.map((val) => ({ value: val }));

  // Color mapping matching the screenshots
  const colorMap = {
    success: {
      hex: "#17c964", // Green
      bg: "bg-success-50",
      text: "text-success-600",
    },
    warning: {
      hex: "#f5a524", // Orange
      bg: "bg-warning-50",
      text: "text-warning-600",
    },
    danger: {
      hex: "#f31260", // Pink/Red
      bg: "bg-danger-50",
      text: "text-danger-600",
    },
  };

  const currentTheme = colorMap[chartColor];
  const gradientId = `colorUv-${title.replace(/\s+/g, "")}`;

  return (
    <Card className="border border-transparent dark:border-default-100 shadow-sm">
      <section className="flex flex-col flex-nowrap h-full justify-between">
        {/* Header Section */}
        <div className="flex justify-between items-start px-4 pt-4">
          <div className="flex flex-col gap-y-1">
            <dt className="text-default-500 text-sm font-medium">{title}</dt>
            <dd className="text-3xl font-bold text-default-900">{value}</dd>
          </div>
          
          <Chip
            classNames={{
              base: cn("h-7 px-2", currentTheme.bg),
              content: cn("font-medium text-xs", currentTheme.text),
            }}
            radius="sm"
            variant="flat"
            startContent={
              <Icon
                className={currentTheme.text}
                icon={change >= 0 ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"}
                width={16}
              />
            }
          >
            {Math.abs(change).toFixed(1)}%
          </Chip>
        </div>

        {/* Chart Section */}
        <div className="h-24 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" className="[&_.recharts-surface]:outline-hidden">
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentTheme.hex} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={currentTheme.hex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={["dataMin", "dataMax"]} hide={true} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={currentTheme.hex}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Card>
  );
}
