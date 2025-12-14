import SignupForm from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">TextSummarizer</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
