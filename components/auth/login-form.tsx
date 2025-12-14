"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { authAPI, setAuthToken } from "@/lib/api"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!username || !password) {
        throw new Error("Please fill in all fields")
      }

      // ✅ CALL FASTAPI LOGIN
      const response = await authAPI.login({
        username,
        password,
      })

      // ✅ SAVE TOKEN
      setAuthToken(response.access_token)

      // ✅ REDIRECT
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-border bg-card p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="hassanOuahmane2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">
              Don't have an account?
            </span>
          </div>
        </div>

        <Link href="/signup" className="block">
          <Button variant="outline" className="w-full">
            Create Account
          </Button>
        </Link>
      </form>
    </Card>
  )
}
