import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyOTPToken } from "@/lib/auth/utils"
import { TokenType } from "@prisma/client"
import { z } from "zod"
import { authRateLimit, checkRedisRateLimit } from "@/lib/rate-limit"
import * as Sentry from "@sentry/nextjs"

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

/**
 * POST /api/verify-email/confirm - Verify OTP and mark email as verified
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (OTP brute-force protection)
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimit = await checkRedisRateLimit(authRateLimit, ip)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { email, otp } = verifyOTPSchema.parse(body)

    // Verify the OTP
    const result = await verifyOTPToken(email, otp, TokenType.EMAIL_VERIFICATION)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Email verification error:", error)
    Sentry.captureException(error, { tags: { route: "verify-email/confirm" } })
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    )
  }
}
