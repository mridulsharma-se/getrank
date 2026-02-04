import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react"

interface StatsRowProps {
  stats: {
    avgChange: number
    bestGain: number
    worstDrop: number
    consistency: number
  }
}

export function StatsRow({ stats }: StatsRowProps) {
  const statItems = [
    {
      label: "Avg Change",
      value: stats.avgChange >= 0 ? `+${stats.avgChange}` : stats.avgChange,
      icon: BarChart3,
      iconColor: stats.avgChange >= 0 ? "text-success" : "text-destructive",
      valueColor: "text-foreground",
    },
    {
      label: "Best Gain",
      value: `+${stats.bestGain}`,
      icon: TrendingUp,
      iconColor: "text-success",
      valueColor: "text-foreground",
    },
    {
      label: "Worst Drop",
      value: stats.worstDrop,
      icon: TrendingDown,
      iconColor: "text-destructive",
      valueColor: "text-foreground",
    },
    {
      label: "Consistency",
      value: `${stats.consistency}%`,
      icon: Target,
      iconColor: "text-primary",
      valueColor: "text-foreground",
    },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent Contest Snapshot</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center p-3 bg-secondary rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            <item.icon className={`w-5 h-5 mb-2 ${item.iconColor}`} />
            <span className={`text-xl font-bold font-mono ${item.valueColor}`}>{item.value}</span>
            <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
