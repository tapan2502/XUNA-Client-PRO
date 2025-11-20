
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

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  chartColor: string;
  data: number[];
}

export default function MetricCard({
  title,
  value,
  change,
  data,
}: MetricCardProps) {
  // Map simple number array to object array for Recharts
  const chartData = data.map((val) => ({ value: val }));

  // Determine color based on change value
  const color =
    change > 0 ? "success" : change < 0 ? "danger" : "warning";

  const colorMap = {
    success: "#17c964",
    danger: "#f31260",
    warning: "#f5a524",
  };

  // Sanitize title for ID usage
  const gradientId = `colorUv-${title.replace(/\s+/g, "")}`;

  return (
    <Card className="dark:border-default-100 border border-transparent">
      <section className="flex flex-col flex-nowrap">
        <div className="flex flex-col justify-between gap-y-2 px-4 pt-4">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-0">
              <dt className="text-default-600 text-sm font-medium">{title}</dt>
            </div>
            <div className="flex items-baseline gap-x-2">
              <dd className="text-default-700 text-xl font-semibold">
                {value}
              </dd>
              <Chip
                classNames={{
                  content: "font-medium",
                }}
                color={color}
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
                <span>{Math.abs(change)}%</span>
              </Chip>
            </div>
          </div>
        </div>
        <div className="min-h-24 w-full">
          <ResponsiveContainer className="[&_.recharts-surface]:outline-hidden">
            <AreaChart
              accessibilityLayer
              className="translate-y-1 scale-105"
              data={chartData}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="10%"
                    stopColor={colorMap[color]}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={colorMap[color]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <YAxis
                domain={[Math.min(...chartData.map((d) => d.value)), "auto"]}
                hide={true}
              />
              <Area
                dataKey="value"
                fill={`url(#${gradientId})`}
                stroke={colorMap[color]}
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
