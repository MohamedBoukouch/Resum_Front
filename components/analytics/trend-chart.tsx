"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { week: "Week 1", processed: 5, summaries: 3 },
  { week: "Week 2", processed: 8, summaries: 5 },
  { week: "Week 3", processed: 6, summaries: 4 },
  { week: "Week 4", processed: 12, summaries: 8 },
  { week: "Week 5", processed: 9, summaries: 7 },
  { week: "Week 6", processed: 14, summaries: 10 },
]

export function TrendChart() {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Usage Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="week" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                color: "hsl(var(--color-foreground))",
              }}
            />
            <Legend wrapperStyle={{ color: "hsl(var(--color-foreground))" }} />
            <Line
              type="monotone"
              dataKey="processed"
              stroke="hsl(var(--color-primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--color-primary))" }}
            />
            <Line
              type="monotone"
              dataKey="summaries"
              stroke="hsl(var(--color-chart-2))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--color-chart-2))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
