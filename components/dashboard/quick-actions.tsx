"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Plus, Upload } from "lucide-react"

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-card border-border p-6 hover:bg-muted/50 transition-colors cursor-pointer">
        <button onClick={() => router.push("/summarize")} className="w-full text-left flex flex-col gap-3 h-full">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">New Summary</h3>
          <p className="text-sm text-muted-foreground">Start a new summarization session</p>
        </button>
      </Card>

      <Card className="bg-card border-border p-6 hover:bg-muted/50 transition-colors cursor-pointer">
        <button onClick={() => router.push("/summarize")} className="w-full text-left flex flex-col gap-3 h-full">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">Upload File</h3>
          <p className="text-sm text-muted-foreground">Upload a document to summarize</p>
        </button>
      </Card>
    </div>
  )
}
