"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SessionsList } from "@/components/dashboard/sessions-list"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true)
  const [leftPanelWidth, setLeftPanelWidth] = useState(400)
  const [isDividerHovered, setIsDividerHovered] = useState(false)
  const isResizingRef = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return
      const newWidth = e.clientX
      if (newWidth >= 300 && newWidth <= 800) {
        setLeftPanelWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      isResizingRef.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleMouseDown = () => {
    isResizingRef.current = true
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Recent Sessions */}
        {isLeftPanelVisible && (
          <div className="bg-background overflow-y-auto flex-shrink-0" style={{ width: `${leftPanelWidth}px` }}>
            <div className="p-3">
              <SessionsList />
            </div>
          </div>
        )}

        {isLeftPanelVisible && (
          <div
            className="relative w-px bg-border cursor-col-resize transition-colors flex-shrink-0"
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsDividerHovered(true)}
            onMouseLeave={() => setIsDividerHovered(false)}
          >
            {/* Invisible hover area for easier grabbing */}
            <div className="absolute inset-y-0 -left-2 -right-2" />
            {/* Thick indicator shown on hover */}
            {isDividerHovered && <div className="absolute inset-y-0 left-0 w-1 bg-primary/70 transition-opacity" />}
          </div>
        )}

        {/* Right Panel - Quick Actions */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Toggle Button */}
            <div className="mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLeftPanelVisible(!isLeftPanelVisible)}
                className="gap-2"
              >
                {isLeftPanelVisible ? (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    Hide Sessions
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    Show Sessions
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
                <p className="text-muted-foreground">Choose an action to get started</p>
              </div>
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
