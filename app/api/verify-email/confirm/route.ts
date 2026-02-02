import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyOTPToken } from "@/lib/auth/utils"
import { TokenType } from "@prisma/client"
import { z } from "zod"

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

/**
 * POST /api/verify-email/confirm - Verify OTP and mark email as verified
 */
export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    )
  }
}
