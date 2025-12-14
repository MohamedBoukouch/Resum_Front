"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Summary", value: 30 },
  { name: "Removed", value: 70 },
]

const COLORS = ["hsl(var(--color-primary))", "hsl(var(--color-muted))"]

export function CompressionChart() {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Compression Ratio</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                color: "hsl(var(--color-foreground))",
              }}
            />
            <Legend
              wrapperStyle={{
                color: "hsl(var(--color-foreground))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
