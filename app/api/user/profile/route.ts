import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const result = profileUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const name = result.data.name.trim()
    const email = result.data.email.toLowerCase().trim()

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }

      // If email changed, mark as unverified
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name,
          email,
          emailVerified: null, // Require re-verification
        },
      })

      return NextResponse.json({
        message: "Profile updated. Please verify your new email address.",
        emailChanged: true,
      })
    }

    // Update only name if email hasn't changed
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      emailChanged: false,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    Sentry.captureException(error, { tags: { route: "user/profile" } })
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
