import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole, AccessStatus } from "@prisma/client"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

const revokeAccessSchema = z.object({
  accessId: z.string().min(1, "Access record ID is required"),
  reason: z.string().optional(),
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
    const parsed = revokeAccessSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data

    const access = await prisma.productAccess.findUnique({ where: { id: data.accessId } })
    if (!access) {
      return NextResponse.json({ error: "Access record not found" }, { status: 404 })
    }

    if (access.status === AccessStatus.REVOKED) {
      return NextResponse.json({ error: "Access is already revoked" }, { status: 409 })
    }

    const updated = await prisma.productAccess.update({
      where: { id: data.accessId },
      data: {
        status: AccessStatus.REVOKED,
        revokedAt: new Date(),
        revokedReason: data.reason || null,
      },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin revoke access error:", error)
    Sentry.captureException(error, { tags: { route: "admin/access/revoke" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
