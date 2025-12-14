import { create } from "zustand"

interface Metadata {
  originalWordCount: number
  summaryWordCount: number
  compressionRatio: string
  processingTime: string
}

interface SummarizationStore {
  summary: string
  metadata: Metadata | null
  setSummary: (summary: string) => void
  setMetadata: (metadata: Metadata) => void
  reset: () => void
}

export const useSummarizationStore = create<SummarizationStore>((set) => ({
  summary: "",
  metadata: null,
  setSummary: (summary) => set({ summary }),
  setMetadata: (metadata) => set({ metadata }),
  reset: () => set({ summary: "", metadata: null }),
}))
