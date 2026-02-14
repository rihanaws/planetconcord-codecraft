import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole, AccessType, AccessStatus } from "@prisma/client"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"
import { sendAccessGrantedEmail } from "@/lib/email/send"

const grantAccessSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  accessType: z.enum(["LIFETIME", "SUBSCRIPTION"]),
  expiresAt: z.string().optional(), // ISO date string for subscriptions
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = grantAccessSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: data.userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: data.productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check for existing access
    const existing = await prisma.productAccess.findUnique({
      where: { userId_productId: { userId: data.userId, productId: data.productId } },
    })

    if (existing) {
      // If already active, return conflict
      if (existing.status === AccessStatus.ACTIVE) {
        return NextResponse.json({ error: "User already has active access to this product" }, { status: 409 })
      }

      // If revoked/expired, re-activate
      const updated = await prisma.productAccess.update({
        where: { id: existing.id },
        data: {
          status: AccessStatus.ACTIVE,
          accessType: data.accessType as AccessType,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          revokedAt: null,
          revokedReason: null,
          grantedAt: new Date(),
        },
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { name: true, slug: true } },
        },
      })

      // Send access granted email
      try {
        const accessUrl = `${process.env.NEXTAUTH_URL}/dashboard/products/${updated.product.slug}`
        await sendAccessGrantedEmail(
          updated.user.email,
          updated.user.name || "Valued Customer",
          updated.product.name,
          accessUrl,
          data.accessType
        )
      } catch (emailError) {
        console.error("Failed to send access granted email:", emailError)
        Sentry.captureException(emailError)
      }

      return NextResponse.json(updated, { status: 200 })
    }

    // Create new access record
    const access = await prisma.productAccess.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        status: AccessStatus.ACTIVE,
        accessType: data.accessType as AccessType,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true } },
      },
    })

    // Send access granted email
    try {
      const accessUrl = `${process.env.NEXTAUTH_URL}/dashboard/products/${access.product.slug}`
      await sendAccessGrantedEmail(
        access.user.email,
        access.user.name || "Valued Customer",
        access.product.name,
        accessUrl,
        data.accessType
      )
    } catch (emailError) {
      console.error("Failed to send access granted email:", emailError)
      Sentry.captureException(emailError)
    }

    return NextResponse.json(access, { status: 201 })
  } catch (error) {
    console.error("Admin grant access error:", error)
    Sentry.captureException(error, { tags: { route: "admin/access/grant" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
