"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles, Upload, X } from "lucide-react"
import { useSummarizationStore } from "@/lib/store/summarization-store"

export function TextInputSection() {
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; content: string }[]>([])
  const [textButtonClicked, setTextButtonClicked] = useState(false)
  const [fileButtonClicked, setFileButtonClicked] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { setSummary, setMetadata } = useSummarizationStore()

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [inputText])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.altKey && !e.shiftKey) {
      // Enter alone: submit
      if (!isLoading && inputText.trim().length > 0) {
        e.preventDefault()
        handleTextSubmit()
      }
    }
    // Alt+Enter or Shift+Enter: allow new line (default behavior - do nothing)
  }

  const handleTextSubmit = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to summarize")
      return
    }

    setTextButtonClicked(true)
    setTimeout(() => setTextButtonClicked(false), 300)

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const sentences = inputText.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      const summaryLength = Math.ceil(sentences.length * 0.3)
      const summary = sentences.slice(0, Math.max(summaryLength, 1)).join(". ") + "."

      setSummary(summary)
      setMetadata({
        originalWordCount: inputText.split(/\s+/).length,
        summaryWordCount: summary.split(/\s+/).length,
        compressionRatio: ((1 - summary.split(/\s+/).length / inputText.split(/\s+/).length) * 100).toFixed(1),
        processingTime: "2s",
      })
    } catch (error) {
      alert("Error generating summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload files to summarize")
      return
    }

    setFileButtonClicked(true)
    setTimeout(() => setFileButtonClicked(false), 300)

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const combinedText = uploadedFiles.map((f) => f.content).join("\n\n")
      const sentences = combinedText.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      const summaryLength = Math.ceil(sentences.length * 0.3)
      const summary = sentences.slice(0, Math.max(summaryLength, 1)).join(". ") + "."

      setSummary(summary)
      setMetadata({
        originalWordCount: combinedText.split(/\s+/).length,
        summaryWordCount: summary.split(/\s+/).length,
        compressionRatio: ((1 - summary.split(/\s+/).length / combinedText.split(/\s+/).length) * 100).toFixed(1),
        processingTime: "2s",
      })
    } catch (error) {
      alert("Error generating summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          setUploadedFiles((prev) => [...prev, { name: file.name, content }])
        }
        reader.readAsText(file)
      })
      e.target.value = ""
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Input Text</h2>
        <p className="text-muted-foreground">Paste or upload text to summarize</p>
      </div>

      <Card className="bg-muted border-border p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2 bg-muted rounded-full px-3 py-2 border-0">
            {/* Upload button on the left - icon only */}
            <Label htmlFor="file-upload" className="cursor-pointer mt-1">
              <Button
                type="button"
                disabled={isLoading}
                className={`rounded-full h-10 w-10 p-0 bg-transparent hover:bg-accent text-foreground border-0 transition-all duration-300 ${
                  fileButtonClicked ? "scale-90" : "scale-100"
                }`}
                asChild
              >
                <span>
                  <Upload
                    className={`h-5 w-5 transition-transform duration-300 ${fileButtonClicked ? "-translate-y-1 scale-110" : ""}`}
                  />
                </span>
              </Button>
            </Label>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={(e) => {
                handleFileUpload(e)
                setFileButtonClicked(true)
                setTimeout(() => setFileButtonClicked(false), 300)
              }}
              className="hidden"
              multiple
            />

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder=""
              rows={1}
              className="flex-1 min-h-[40px] max-h-[200px] px-4 py-2 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none overflow-y-auto"
            />

            {/* Summarize button on the right - icon only */}
            <Button
              onClick={handleTextSubmit}
              disabled={isLoading || inputText.trim().length === 0}
              className={`rounded-full h-10 w-10 p-0 mt-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                textButtonClicked ? "scale-90" : "scale-100"
              }`}
            >
              <Sparkles
                className={`h-5 w-5 transition-transform duration-300 ${textButtonClicked ? "rotate-180 scale-110" : ""}`}
              />
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Uploaded Files</Label>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Upload className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        ({file.content.split(/\s+/).filter((w) => w.length > 0).length} words)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0 hover:bg-muted flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
