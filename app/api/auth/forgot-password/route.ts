import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createOTPToken } from "@/lib/auth/utils"
import { sendPasswordResetEmail } from "@/lib/email/send"
import { TokenType } from "@prisma/client"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

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
    return NextResponse.json(
      { error: "Failed to send reset code" },
      { status: 500 }
    )
  }
}
