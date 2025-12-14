"use client"

import { Card } from "@/components/ui/card"
import { CompressionChart } from "./compression-chart"
import { TrendChart } from "./trend-chart"
import { StatisticsGrid } from "./statistics-grid"
import { WordFrequencyChart } from "./word-frequency-chart"

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Visualize your summarization performance and patterns</p>
      </div>

      <StatisticsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompressionChart />
        <TrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WordFrequencyChart />
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: "Summarized Q3 Report", time: "2 hours ago", words: "5,420 → 450" },
              { action: "Processed research paper", time: "5 hours ago", words: "8,932 → 650" },
              { action: "Transcription summary", time: "1 day ago", words: "3,200 → 280" },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <p className="text-sm text-primary font-semibold">{activity.words}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
