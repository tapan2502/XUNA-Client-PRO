import { Card, CardBody, Chip } from "@heroui/react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  chartColor: string
  data: number[]
}

export default function MetricCard({ title, value, change, chartColor, data }: MetricCardProps) {
  const isPositive = change >= 0

  return (
    <Card className="bg-content1">
      <CardBody className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-foreground-500">{title}</p>
              <h3 className="text-3xl font-semibold mt-1">{value}</h3>
            </div>
            <Chip
              size="sm"
              variant="flat"
              color={isPositive ? "success" : "danger"}
              startContent={isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            >
              {isPositive ? "+" : ""}
              {change}%
            </Chip>
          </div>

          {/* Simple SVG chart */}
          <div className="h-20 w-full">
            <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={chartColor} stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d={`M 0 ${80 - data[0]} ${data.map((val, i) => `L ${(i * 300) / (data.length - 1)} ${80 - val}`).join(" ")}`}
                fill={`url(#gradient-${title})`}
                stroke={chartColor}
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
