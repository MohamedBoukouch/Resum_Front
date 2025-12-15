"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { authAPI, saveToken, saveUser } from "@/lib/api"

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
      if (!username || !password) throw new Error("Please fill in all fields")

      // Call backend login API
      const res = await authAPI.login({ username, password })

      // Save token & user info
      saveToken(res.access_token)
      saveUser(res.user)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-4 max-w-md mx-auto mt-20">
      {error && (
        <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <Label>Username</Label>
      <Input
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={isLoading}
        placeholder="Enter your username"
      />

      <Label>Password</Label>
      <Input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={isLoading}
        placeholder="Enter your password"
      />

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full mt-4"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </Card>
  )
}
