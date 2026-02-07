import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createOTPToken } from "@/lib/auth/utils"
import { sendVerificationEmail } from "@/lib/email/send"
import { TokenType } from "@prisma/client"
import { z } from "zod"
import { authRateLimit, checkRedisRateLimit } from "@/lib/rate-limit"
import * as Sentry from "@sentry/nextjs"

const sendOTPSchema = z.object({
  email: z.string().email(),
})

/**
 * POST /api/verify-email - Send OTP to email
 * Used for both initial signup and resending OTP
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimit = await checkRedisRateLimit(authRateLimit, ip)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { email } = sendOTPSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that user doesn't exist (security best practice)
      return NextResponse.json(
        { message: "If an account exists with this email, a verification code has been sent." },
        { status: 200 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      )
    }

    // Generate and send new OTP
    const otp = await createOTPToken(email, TokenType.EMAIL_VERIFICATION)
    await sendVerificationEmail(email, user.name || "User", otp)

    return NextResponse.json(
      { message: "Verification code sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Send OTP error:", error)
    Sentry.captureException(error, { tags: { route: "verify-email" } })
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    )
  }
}
