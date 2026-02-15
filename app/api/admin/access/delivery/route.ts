import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

const accessDeliverySchema = z.object({
  accessId: z.string().min(1),
  deliveryStatus: z.enum(["PENDING", "DELIVERED", "BACKLOGGED"]),
  backlogNotes: z.string().optional().nullable(),
})

export async function PATCH(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = accessDeliverySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { accessId, deliveryStatus, backlogNotes } = parsed.data

    const access = await prisma.productAccess.findUnique({ where: { id: accessId } })
    if (!access) {
      return NextResponse.json({ error: "Access record not found" }, { status: 404 })
    }

    const updated = await prisma.productAccess.update({
      where: { id: accessId },
      data: {
        deliveryStatus,
        deliveredAt: deliveryStatus === "DELIVERED" ? new Date() : access.deliveredAt,
        backlogNotes: backlogNotes ?? null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin access delivery update error:", error)
    Sentry.captureException(error, { tags: { route: "admin/access/delivery", method: "PATCH" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
