"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { authAPI, setAuthToken } from "@/lib/api"

// ============================
// TYPES (Backend Compatible)
// ============================

type AuthMode = "login" | "signup"

interface LoginFormData {
  username: string // Backend expects username for login
  password: string
}

interface SignupFormData {
  email: string // Backend: test@example.com
  username: string // Backend: testuser
  password: string // Backend: Password123!
  full_name: string // Backend: Test User
  confirmPassword: string // Frontend only validation
}

// ============================
// COMPONENT
// ============================

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: "",
    password: "",
  })

  // Signup form state
  const [signupData, setSignupData] = useState<SignupFormData>({
    email: "",
    username: "",
    password: "",
    full_name: "",
    confirmPassword: "",
  })

  // ============================
  // INPUT HANDLERS
  // ============================

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupData((prev) => ({ ...prev, [name]: value }))
  }

  // ============================
  // VALIDATION
  // ============================

  const validateLogin = (): string | null => {
    if (!loginData.username) return "Username is required"
    if (!loginData.password) return "Password is required"
    return null
  }

  const validateSignup = (): string | null => {
    if (!signupData.full_name) return "Full name is required"
    if (!signupData.email) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email))
      return "Please enter a valid email"
    if (!signupData.username) return "Username is required"
    if (signupData.username.length < 3)
      return "Username must be at least 3 characters"
    if (!signupData.password) return "Password is required"
    if (signupData.password.length < 8)
      return "Password must be at least 8 characters"
    if (!/(?=.*[A-Z])/.test(signupData.password))
      return "Password must contain at least one uppercase letter"
    if (!/(?=.*[!@#$%^&*])/.test(signupData.password))
      return "Password must contain at least one special character"
    if (signupData.password !== signupData.confirmPassword)
      return "Passwords do not match"
    return null
  }

  // ============================
  // LOGIN HANDLER
  // ============================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const error = validateLogin()
    if (error) {
      setIsError(true)
      setMessage(error)
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.login({
        username: loginData.username,
        password: loginData.password,
      })

      // Save token
      setAuthToken(response.access_token)

      setMessage("Login successful! Redirecting...")
      setIsError(false)

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      setIsError(true)
      setMessage(error.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  // ============================
  // SIGNUP HANDLER
  // ============================

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const error = validateSignup()
    if (error) {
      setIsError(true)
      setMessage(error)
      return
    }

    setIsLoading(true)

    try {
      await authAPI.signup({
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
        full_name: signupData.full_name,
      })

      setMessage("Account created successfully! Please log in.")
      setIsError(false)

      // Switch to login mode after successful signup
      setTimeout(() => {
        setMode("login")
        setLoginData({
          username: signupData.username,
          password: signupData.password,
        })
      }, 1500)
    } catch (error: any) {
      setIsError(true)
      setMessage(error.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ============================
  // MODE TOGGLE
  // ============================

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"))
    setMessage(null)
    setIsError(false)
  }

  // ============================
  // RENDER
  // ============================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "login"
              ? "Sign in to continue to your account"
              : "Sign up to get started"}
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`flex gap-2 p-3 rounded-lg ${
              isError
                ? "bg-destructive/10 text-destructive"
                : "bg-green-500/10 text-green-700"
            }`}
          >
            {isError ? (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={loginData.username}
                onChange={handleLoginChange}
                disabled={isLoading}
                placeholder="Enter your username"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={isLoading}
                placeholder="Enter your password"
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={signupData.full_name}
                onChange={handleSignupChange}
                disabled={isLoading}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={signupData.email}
                onChange={handleSignupChange}
                disabled={isLoading}
                placeholder="Enter your email"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="signup_username">Username</Label>
              <Input
                id="signup_username"
                name="username"
                type="text"
                value={signupData.username}
                onChange={handleSignupChange}
                disabled={isLoading}
                placeholder="Choose a username"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="signup_password">Password</Label>
              <Input
                id="signup_password"
                name="password"
                type="password"
                value={signupData.password}
                onChange={handleSignupChange}
                disabled={isLoading}
                placeholder="Min 8 chars, 1 uppercase, 1 special"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Example: Password123!
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                disabled={isLoading}
                placeholder="Confirm your password"
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        )}

        {/* TOGGLE MODE */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </Card>
    </div>
  )
}