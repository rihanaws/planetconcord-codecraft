"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"

interface VerifyOtpFormProps {
  email: string
  onSuccess?: () => void
}

export function VerifyOtpForm({ email, onSuccess }: VerifyOtpFormProps) {
  const router = useRouter()

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Handle cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5)
    const lastInput = document.getElementById(`otp-${lastIndex}`)
    lastInput?.focus()
  }

  const handleVerify = async () => {
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/verify-email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Verification failed")
        return
      }

      setSuccess(true)

      // Auto sign in and redirect after 1 second
      setTimeout(async () => {
        if (onSuccess) {
          onSuccess()
        } else {
          await signIn("credentials", {
            email,
            redirect: false,
          })
          router.push("/dashboard")
        }
      }, 1000)
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError(null)

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to resend code")
        return
      }

      setResendCooldown(60) // 60 second cooldown
      setOtp(["", "", "", "", "", ""])
    } catch {
      setError("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <div className="w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">Email verified!</h1>
        <p className="text-muted-foreground">
          Your email has been successfully verified. Redirecting you to your dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Error message */}
      {error && (
        <Alert className="mb-6 border-destructive/50 bg-destructive/10 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive ml-2">{error}</p>
        </Alert>
      )}

      {/* OTP Input */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-center block">
          Enter verification code
        </Label>

        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-ring/20 focus:scale-105"
              disabled={isVerifying || isResending}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          The code will expire in 10 minutes
        </p>
      </div>

      {/* Verify button */}
      <Button
        onClick={handleVerify}
        className="w-full h-11 mt-6 group relative overflow-hidden"
        disabled={isVerifying || isResending || otp.join("").length !== 6}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        {isVerifying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span className="font-medium">Verify email</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      {/* Resend button */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          className="text-sm font-medium hover:bg-accent"
        >
          {isResending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : resendCooldown > 0 ? (
            `Resend in ${resendCooldown}s`
          ) : (
            "Resend code"
          )}
        </Button>
      </div>
    </div>
  )
}
