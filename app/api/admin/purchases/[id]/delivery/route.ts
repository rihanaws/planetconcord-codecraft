import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

const deliveryUpdateSchema = z.object({
  deliveryConfirmed: z.boolean().optional(),
  deliveryNotes: z.string().optional().nullable(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    const body: unknown = await request.json()
    const parsed = deliveryUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const purchase = await prisma.purchase.findUnique({ where: { id } })
    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    const data = parsed.data
    const updateData: Record<string, unknown> = {}

    if (data.deliveryConfirmed !== undefined) {
      updateData.deliveryConfirmed = data.deliveryConfirmed
      if (data.deliveryConfirmed) {
        updateData.deliveredAt = new Date()
      }
    }

    if (data.deliveryNotes !== undefined) {
      updateData.deliveryNotes = data.deliveryNotes
    }

    const updated = await prisma.purchase.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })

    // Also update the corresponding ProductAccess delivery status
    if (data.deliveryConfirmed) {
      await prisma.productAccess.updateMany({
        where: {
          userId: purchase.userId,
          productId: purchase.productId,
        },
        data: {
          deliveryStatus: "DELIVERED",
          deliveredAt: new Date(),
        },
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin delivery update error:", error)
    Sentry.captureException(error, { tags: { route: "admin/purchases/delivery", method: "PATCH" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
