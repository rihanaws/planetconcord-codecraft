"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { Loader2, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "Code must be 6 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch("password")

  // Password strength indicators
  const passwordChecks = [
    { label: "At least 8 characters", met: password?.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password || "") },
    { label: "One lowercase letter", met: /[a-z]/.test(password || "") },
    { label: "One number", met: /[0-9]/.test(password || "") },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password || "") },
  ]

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: data.otp,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to reset password")
        return
      }

      setSuccess(true)
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Password reset successful!</h1>
          <p className="text-muted-foreground">
            Your password has been successfully reset. Redirecting you to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: "6s", animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Create new password</h1>
          <p className="text-sm text-muted-foreground">
            Enter the code sent to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {/* Main card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 transition-all duration-300 hover:shadow-primary/10 hover:border-border">
          {/* Error message */}
          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive ml-2">{error}</p>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* OTP field */}
            <div className="space-y-2 group">
              <Label
                htmlFor="otp"
                className="text-sm font-medium transition-colors group-focus-within:text-foreground"
              >
                Verification code
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="h-11 text-center text-lg font-semibold tracking-widest transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                disabled={isLoading}
                {...register("otp")}
              />
              {errors.otp && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* New password field */}
            <div className="space-y-2 group">
              <Label
                htmlFor="password"
                className="text-sm font-medium transition-colors group-focus-within:text-foreground"
              >
                New password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                  disabled={isLoading}
                  {...register("password")}
                />
              </div>

              {/* Password strength indicators */}
              {password && (
                <div className="space-y-1.5 pt-2 animate-in fade-in slide-in-from-top-2">
                  {passwordChecks.map((check, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs transition-all duration-200"
                    >
                      <div
                        className={`h-1 w-1 rounded-full transition-all duration-200 ${
                          check.met ? "bg-primary scale-125" : "bg-muted-foreground/30"
                        }`}
                      />
                      <span
                        className={`transition-colors duration-200 ${
                          check.met ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password field */}
            <div className="space-y-2 group">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium transition-colors group-focus-within:text-foreground"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-11 group relative overflow-hidden"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="font-medium">Reset password</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Back to login link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}
