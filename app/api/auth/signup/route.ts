import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { hashPassword, validatePasswordStrength } from "@/lib/auth/utils"
import { createOTPToken } from "@/lib/auth/utils"
import { sendVerificationEmail } from "@/lib/email/send"
import { TokenType } from "@prisma/client"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = signupSchema.parse(body)

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Weak password", details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // emailVerified will be set after OTP verification
      },
    })

    // Generate and send OTP
    const otp = await createOTPToken(email, TokenType.EMAIL_VERIFICATION)
    await sendVerificationEmail(email, name, otp)

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email for verification code.",
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
