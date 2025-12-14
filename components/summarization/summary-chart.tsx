"use client"

import { useEffect, useRef } from "react"

interface SummaryChartProps {
  summary: string
  metadata: any
}

export function SummaryChart({ summary, metadata }: SummaryChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const extractTopics = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const topics = sentences
      .slice(0, 5)
      .map((s) => {
        const words = s.trim().split(/\s+/)
        return words.slice(0, 4).join(" ")
      })
      .filter((t) => t.length > 0)

    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 5)
      .reduce(
        (acc, word) => {
          acc[word] = (acc[word] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    const keywords = Object.entries(words)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([word]) => word)

    return { topics, keywords }
  }

  const { topics, keywords } = extractTopics(summary)

  useEffect(() => {
    if (!canvasRef.current || !metadata) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Get theme colors
    const isDark = document.documentElement.classList.contains("dark")
    const centerColor = "#3b82f6"
    const nodeColor = isDark ? "#1e293b" : "#f1f5f9"
    const nodeStroke = "#3b82f6"
    const textColor = isDark ? "#f1f5f9" : "#1e293b"
    const lineColor = isDark ? "#475569" : "#cbd5e1"

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // Draw center node
    ctx.fillStyle = centerColor
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "white"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Summary", centerX, centerY - 8)
    ctx.fillText("Insight", centerX, centerY + 8)

    // Calculate positions for branch nodes
    const nodeRadius = 35
    const distance = 180
    const totalNodes = topics.length + keywords.length
    const angleStep = (Math.PI * 2) / totalNodes

    let nodeIndex = 0

    // Draw topic branches
    topics.forEach((topic) => {
      const angle = angleStep * nodeIndex
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      // Draw line from center
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Draw node
      ctx.fillStyle = nodeColor
      ctx.strokeStyle = nodeStroke
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Draw text
      ctx.fillStyle = textColor
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const lines = topic.split(" ")
      lines.forEach((line, idx) => {
        ctx.fillText(line, x, y + (idx - lines.length / 2 + 0.5) * 15)
      })

      nodeIndex++
    })

    // Draw keyword branches
    keywords.forEach((keyword) => {
      const angle = angleStep * nodeIndex
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      // Draw line from center
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Draw node
      ctx.fillStyle = nodeColor
      ctx.strokeStyle = nodeStroke
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Draw text
      ctx.fillStyle = textColor
      ctx.font = "11px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const displayText = keyword.charAt(0).toUpperCase() + keyword.slice(1)
      ctx.fillText(displayText, x, y)

      nodeIndex++
    })
  }, [topics, keywords, metadata])

  if (!metadata) return null

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-foreground mb-4">Summary Mind Map</p>
        <canvas
          ref={canvasRef}
          className="w-full border border-border rounded-lg bg-background"
          style={{ height: "400px" }}
        />
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Original Words</p>
            <p className="text-lg font-semibold text-foreground">{metadata.originalWordCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Summary Words</p>
            <p className="text-lg font-semibold text-foreground">{metadata.summaryWordCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Compression</p>
            <p className="text-lg font-semibold text-foreground">{metadata.compressionRatio}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Processing</p>
            <p className="text-lg font-semibold text-foreground">{metadata.processingTime}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
