"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { word: "technology", count: 12 },
  { word: "innovation", count: 9 },
  { word: "development", count: 8 },
  { word: "solution", count: 7 },
  { word: "process", count: 6 },
]

export function WordFrequencyChart() {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Top Keywords</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="word" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                color: "hsl(var(--color-foreground))",
              }}
            />
            <Legend wrapperStyle={{ color: "hsl(var(--color-foreground))" }} />
            <Bar dataKey="count" fill="hsl(var(--color-chart-1))" radius={[8, 8, 0, 0]} name="Frequency" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
