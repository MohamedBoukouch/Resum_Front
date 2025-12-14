"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Download, Copy, BarChart3 } from "lucide-react"
import { useSummarizationStore } from "@/lib/store/summarization-store"
import { useState } from "react"
import { SummaryChart } from "./summary-chart"

export function SummaryOutput() {
  const { summary, metadata } = useSummarizationStore()
  const [copied, setCopied] = useState(false)
  const [showChart, setShowChart] = useState(false)

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Summary Output</h2>
        <p className="text-muted-foreground">Your AI-generated summary</p>
      </div>

      <Card className="bg-card border-border p-6">
        {summary ? (
          <div className="space-y-4">
            <div className="flex gap-2 border-b border-border pb-4 mb-4">
              <Button
                onClick={() => setShowChart(false)}
                variant={showChart ? "outline" : "default"}
                className={
                  showChart
                    ? "border-border text-foreground hover:bg-muted bg-transparent"
                    : "bg-primary text-primary-foreground"
                }
              >
                Summary Text
              </Button>
              <Button
                onClick={() => setShowChart(true)}
                variant={!showChart ? "outline" : "default"}
                className={
                  !showChart
                    ? "border-border text-foreground hover:bg-muted bg-transparent"
                    : "bg-primary text-primary-foreground"
                }
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Chart
              </Button>
            </div>

            {showChart ? (
              <SummaryChart summary={summary} metadata={metadata} />
            ) : (
              <>
                <div>
                  <p className="text-foreground leading-relaxed text-justify">{summary}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">Your summary will appear here</p>
            <p className="text-sm text-muted-foreground">Enter text and click "Generate Summary" to get started</p>
          </div>
        )}
      </Card>
    </div>
  )
}
