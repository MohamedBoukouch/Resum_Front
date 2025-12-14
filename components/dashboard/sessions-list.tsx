"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2 } from "lucide-react"

interface Session {
  id: string
  title: string
  createdAt: string
  preview: string
}

const mockSessions: Session[] = [
  {
    id: "1",
    title: "Q3 Financial Report Summary",
    createdAt: "2 days ago",
    preview: "Summary of quarterly financial results...",
  },
  {
    id: "2",
    title: "Research Paper Abstract",
    createdAt: "5 days ago",
    preview: "Analysis of machine learning algorithms...",
  },
  {
    id: "3",
    title: "Meeting Transcription",
    createdAt: "1 week ago",
    preview: "Discussion about project timeline...",
  },
  {
    id: "4",
    title: "Product Requirements Doc",
    createdAt: "2 weeks ago",
    preview: "Key features and specifications...",
  },
  {
    id: "5",
    title: "Customer Feedback Analysis",
    createdAt: "3 weeks ago",
    preview: "Insights from user surveys...",
  },
]

export function SessionsList() {
  const [sessions] = useState<Session[]>(mockSessions)
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <div className="px-3 py-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</h2>
      </div>

      <div className="space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative rounded-lg transition-colors ${
              activeId === session.id ? "bg-muted" : "hover:bg-muted/50"
            }`}
            onMouseEnter={() => setActiveId(session.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <button
              className="w-full text-left px-3 py-2.5 flex items-start gap-3"
              onClick={() => {
                /* Navigate to session */
              }}
            >
              <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{session.preview}</p>
              </div>
            </button>

            {activeId === session.id && (
              <div className="absolute right-2 top-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle delete
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="px-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">No sessions yet</p>
        </div>
      )}
    </div>
  )
}
