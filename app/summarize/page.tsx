"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TextInputSection } from "@/components/summarization/text-input-section"
import { SummaryOutput } from "@/components/summarization/summary-output"
import { useSummarizationStore } from "@/lib/store/summarization-store"

export default function SummarizePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { summary } = useSummarizationStore()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {summary ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TextInputSection />
            <SummaryOutput />
          </div>
        ) : (
          <div className="flex justify-center items-start">
            <div className="w-full max-w-2xl">
              <TextInputSection />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
