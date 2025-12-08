import React from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
  Chip,
} from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
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
  subtitle,
  value,
  change,
  color,
  data,
}: KpiStatsCardProps) {
  // Generate a unique ID for the gradient to avoid conflicts when multiple cards are rendered
  const gradientId = React.useId();

  // Helper function to get chart color - cn() is for classNames, not inline values!
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

  // Get background gradient for the chart area
  const getChartBgGradient = (): string => {
    const bgMap = {
      success: "linear-gradient(to bottom, rgba(23, 201, 100, 0.08), rgba(23, 201, 100, 0.02))",
      primary: "linear-gradient(to bottom, rgba(0, 111, 238, 0.08), rgba(0, 111, 238, 0.02))",
      secondary: "linear-gradient(to bottom, rgba(147, 83, 211, 0.08), rgba(147, 83, 211, 0.02))",
      warning: "linear-gradient(to bottom, rgba(245, 165, 36, 0.08), rgba(245, 165, 36, 0.02))",
      danger: "linear-gradient(to bottom, rgba(243, 18, 96, 0.08), rgba(243, 18, 96, 0.02))",
      default: "linear-gradient(to bottom, rgba(113, 113, 122, 0.08), rgba(113, 113, 122, 0.02))",
    };
    return bgMap[color] || bgMap.default;
  };

  return (
    <Card 
      className="dark:border-default-100 border border-transparent overflow-hidden"
      style={{
        background: getChartBgGradient(),
      }}
    >
      <section className="flex flex-col flex-nowrap">
        <div className="flex flex-col justify-between gap-y-2 px-4 pt-4">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-0">
              <dt className="text-default-600 text-sm font-medium">{title}</dt>
              {subtitle && (
                <dt className="text-tiny text-default-400 font-normal">
                  {subtitle}
                </dt>
              )}
            </div>
            <div className="flex items-baseline gap-x-2">
              <dd className="text-default-700 text-xl font-semibold">{value}</dd>
              <Chip
                classNames={{
                  content: "font-medium",
                }}
                color={
                  color === "success"
                    ? "success"
                    : color === "primary"
                    ? "primary"
                    : color === "secondary"
                    ? "secondary"
                    : color === "warning"
                    ? "warning"
                    : color === "danger"
                    ? "danger"
                    : "default"
                }
                radius="sm"
                size="sm"
                startContent={
                  color === "success" ? (
                    <Icon
                      height={16}
                      icon={"solar:arrow-right-up-linear"}
                      width={16}
                    />
                  ) : color === "danger" ? (
                    <Icon
                      height={16}
                      icon={"solar:arrow-right-down-linear"}
                      width={16}
                    />
                  ) : (
                    <Icon
                      height={16}
                      icon={"solar:arrow-right-linear"}
                      width={16}
                    />
                  )
                }
                variant="flat"
              >
                <span>{change}</span>
              </Chip>
            </div>
          </div>
        </div>
        <div className="min-h-28 w-full mt-2">
          <ResponsiveContainer className="[&_.recharts-surface]:outline-hidden">
            <AreaChart
              accessibilityLayer
              className="translate-y-1 scale-105"
              data={data}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="10%"
                    stopColor={chartColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor={chartColor}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <YAxis
                domain={[Math.min(...data.map((d) => d.value)), "auto"]}
                hide={true}
              />
              <Area
                dataKey="value"
                fill={`url(#${gradientId})`}
                stroke={chartColor}
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Dropdown
          classNames={{
            content: "min-w-[120px]",
          }}
          placement="bottom-end"
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              className="absolute top-2 right-2 w-auto rounded-full"
              size="sm"
              variant="light"
            >
              <Icon height={16} icon="solar:menu-dots-bold" width={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            itemClasses={{
              title: "text-tiny",
            }}
            variant="flat"
          >
            <DropdownItem key="view-details">View Details</DropdownItem>
            <DropdownItem key="export-data">Export Data</DropdownItem>
            <DropdownItem key="set-alert">Set Alert</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </section>
    </Card>
  );
}
