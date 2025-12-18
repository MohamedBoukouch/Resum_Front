"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Send, Upload, Sparkles, MessageSquare, BookOpen, Loader2 } from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  interactiveData?: any
}

interface SummaryMode {
  value: string
  label: string
  icon: string
  description: string
}

export default function SummarizePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [documentText, setDocumentText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState('explanation')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const modes: SummaryMode[] = [
    { value: 'summary', label: 'Summary', icon: '📝', description: 'Quick overview' },
    { value: 'explanation', label: 'Explain', icon: '🎓', description: 'Detailed explanation' },
    { value: 'analysis', label: 'Analyze', icon: '🔍', description: 'Deep analysis' },
    { value: 'key_points', label: 'Key Points', icon: '📌', description: 'Main takeaways' },
    { value: 'eli5', label: 'ELI5', icon: '🧒', description: 'Simple terms' },
  ]

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [inputText])

  // Get token helper function
  const getAuthToken = () => {
    // Try different possible token storage keys
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken')
    
    if (!token) {
      console.error('No authentication token found')
      alert('Please login again')
      router.push('/login')
      return null
    }
    return token
  }

  const handleFileUpload = async (file: File) => {
    const token = getAuthToken()
    if (!token) return

    setUploadedFile(file)
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    
    // Add mode as form field (not in FormData, use URL params instead)
    const url = `http://127.0.0.1:8000/api/summarization/upload?mode=${selectedMode}`

    try {
      console.log('Uploading file:', file.name)
      console.log('Using mode:', selectedMode)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      console.log('Upload response status:', response.status)

      if (response.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Upload error:', errorData)
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await response.json()
      console.log('Upload successful:', data)
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `📄 Uploaded: ${file.name}`,
        timestamp: new Date(),
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.summary,
        timestamp: new Date(),
        interactiveData: data.interactive_data,
      }

      setMessages(prev => [...prev, userMessage, assistantMessage])
      setDocumentText(data.original_text)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() && !documentText) {
      alert('Please enter some text or upload a document first')
      return
    }

    const token = getAuthToken()
    if (!token) return

    const textToProcess = documentText || inputText.trim()
    
    if (textToProcess.length < 20) {
      alert('Please provide at least 20 characters of text')
      return
    }

    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim() || 'Analyze this document',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    const currentInput = inputText.trim()
    setInputText('')

    try {
      console.log('Sending text for analysis...')
      console.log('Mode:', selectedMode)
      console.log('Text length:', textToProcess.length)
      
      const response = await fetch('http://127.0.0.1:8000/api/summarization/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: textToProcess,
          mode: selectedMode,
          user_prompt: currentInput || undefined,
          max_words: 800,
        }),
      })

      console.log('Generate response status:', response.status)

      if (response.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Generate error:', errorData)
        throw new Error(errorData.detail || 'Failed to generate summary')
      }

      const data = await response.json()
      console.log('Generation successful')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.summary,
        timestamp: new Date(),
        interactiveData: data.interactive_data,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Generate error:', error)
      alert(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      // Remove the user message if the request failed
      setMessages(prev => prev.filter(m => m.id !== userMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const renderInteractiveData = (data: any) => {
    if (!data) return null

    return (
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
        {data.main_idea && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              💡 Main Idea
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.main_idea}</p>
          </div>
        )}
        
        {data.why_it_matters && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              🎯 Why It Matters
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.why_it_matters}</p>
          </div>
        )}
        
        {data.real_world_examples && data.real_world_examples.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              🌍 Real-World Examples
            </h4>
            <ul className="space-y-2">
              {data.real_world_examples.map((example: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border-l-4 border-primary">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {data.key_takeaways && data.key_takeaways.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              📌 Key Takeaways
            </h4>
            <ul className="space-y-2">
              {data.key_takeaways.map((takeaway: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border-l-4 border-primary">
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {data.related_concepts && data.related_concepts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              🔗 Related Concepts
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.related_concepts.map((concept: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.simple_analogy && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              🎨 Simple Analogy
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
              {data.simple_analogy}
            </p>
          </div>
        )}
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <DashboardHeader />
      
      <main className="h-[calc(100vh-4rem)] flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-gray-900">TextSummarizer</h1>
            </div>
            <p className="text-sm text-gray-600">Interactive AI-powered analysis</p>
          </div>

          {/* Upload Section */}
          <div className="p-6 border-b border-gray-200">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/80"
            >
              <Upload className="w-12 h-12 mx-auto mb-3 text-primary" />
              <div className="text-sm font-medium text-gray-900">
                {uploadedFile ? uploadedFile.name : 'Upload Document'}
              </div>
              <div className="text-xs text-gray-500 mt-1">PDF, DOCX, or Images</div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.png,.jpg,.jpeg"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Modes Section */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Analysis Mode</h3>
            <div className="space-y-2">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setSelectedMode(mode.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedMode === mode.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{mode.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{mode.label}</div>
                    <div className="text-xs text-gray-500">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-8 py-5 border-b border-gray-200 bg-gradient-to-r from-primary to-purple-600">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversation
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <BookOpen className="w-20 h-20 text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Analysis</h3>
                <p className="text-gray-600 max-w-md">
                  Upload a document or paste text (minimum 20 characters) to begin an interactive conversation with AI
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 mb-6 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-primary to-purple-600'
                          : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                      }`}
                    >
                      {message.type === 'user' ? '👤' : '🤖'}
                    </div>

                    {/* Content */}
                    <div
                      className={`max-w-[70%] rounded-2xl p-5 shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      {message.type === 'assistant' && renderInteractiveData(message.interactiveData)}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                      🤖
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm text-gray-600">Analyzing your text...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus-within:border-primary focus-within:bg-white transition-all">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Ask a question or paste text to analyze (min 20 characters)..."
                  rows={1}
                  className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-gray-900 placeholder-gray-400 max-h-32"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputText.trim() && !documentText)}
                className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 text-white rounded-xl flex items-center justify-center transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}