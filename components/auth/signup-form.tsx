"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { authAPI, saveToken, saveUser } from "@/lib/api"

export function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      // Validation
      if (!fullName || !email || !username || !password || !confirmPassword) {
        throw new Error("Please fill in all fields")
      }
      
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Please enter a valid email address")
      }
      
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters")
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }
      
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Call backend signup API
      const signupData = {
        email,
        username,
        password,
        full_name: fullName
      }
      
      const response = await authAPI.signup(signupData)
      
      // Save token and user data
      saveToken(response.access_token)
      saveUser(response.user)
      
      setSuccess("Account created successfully! Redirecting to dashboard...")
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
      
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-border bg-card p-6 max-w-md mx-auto mt-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign up to get started with TextSummarizer
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex gap-2 rounded-lg bg-green-500/10 p-3 text-green-700">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-foreground">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            required
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
        >
          {isLoading ? (
            <>
              <span className="mr-2">Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative pt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        <Link href="/login" className="block">
          <Button
            type="button"
            variant="outline"
            className="w-full border-border text-foreground hover:bg-muted bg-transparent"
            disabled={isLoading}
          >
            Sign In
          </Button>
        </Link>
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </Card>
  )
}