import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">TextSummarizer</h1>
          <p className="text-muted-foreground">Transform lengthy documents into concise summaries</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
