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
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-xl p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              isPositive
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? "+" : ""}
            {change}%
          </div>
        </div>

        <div className="h-20 w-full">
          <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={chartColor} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 ${80 - data[0]} ${data.map((val, i) => `L ${(i * 300) / (data.length - 1)} ${80 - val}`).join(" ")} L 300 80 L 0 80 Z`}
              fill={`url(#gradient-${title})`}
            />
            <path
              d={`M 0 ${80 - data[0]} ${data.map((val, i) => `L ${(i * 300) / (data.length - 1)} ${80 - val}`).join(" ")}`}
              fill="none"
              stroke={chartColor}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
