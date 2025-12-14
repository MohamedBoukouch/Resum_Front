import { Card } from "@/components/ui/card"
import { TrendingUp, Zap, FileText, Clock } from "lucide-react"

export function StatisticsGrid() {
  const stats = [
    {
      label: "Total Documents",
      value: "342",
      icon: FileText,
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      label: "Total Words Processed",
      value: "1.2M",
      icon: TrendingUp,
      color: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      label: "Avg. Compression",
      value: "68%",
      icon: Zap,
      color: "bg-amber-500/10",
      textColor: "text-amber-500",
    },
    {
      label: "Avg. Processing Time",
      value: "1.2s",
      icon: Clock,
      color: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i} className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
