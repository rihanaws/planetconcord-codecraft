import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createOTPToken } from "@/lib/auth/utils"
import { sendPasswordResetEmail } from "@/lib/email/send"
import { TokenType } from "@prisma/client"
import { z } from "zod"
import { verifyRecaptcha } from "@/lib/recaptcha"
import * as Sentry from "@sentry/nextjs"

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  recaptchaToken: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = forgotPasswordSchema.parse(body)
    const email = parsed.email.toLowerCase().trim()
    const recaptchaToken = parsed.recaptchaToken

    // Verify reCAPTCHA
    const recaptcha = await verifyRecaptcha(recaptchaToken, "FORGOT_PASSWORD")
    if (!recaptcha.success) {
      return NextResponse.json({ error: recaptcha.error || "Security check failed" }, { status: 403 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Don't reveal if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, a reset code has been sent." },
        { status: 200 }
      )
    }

    // Check if user has a password (not OAuth-only)
    if (!user.password) {
      return NextResponse.json(
        { error: "This account uses Google sign-in. Please sign in with Google." },
        { status: 400 }
      )
    }

    // Generate and send OTP
    const otp = await createOTPToken(email, TokenType.PASSWORD_RESET)
    await sendPasswordResetEmail(email, user.name || "User", otp)

    return NextResponse.json(
      { message: "Password reset code sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Forgot password error:", error)
    Sentry.captureException(error, { tags: { route: "auth/forgot-password" } })
    return NextResponse.json(
      { error: "Failed to send reset code" },
      { status: 500 }
    )
  }
}
