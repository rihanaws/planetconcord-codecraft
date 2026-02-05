import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETE", "CANCELLED"]).optional(),
  adminNotes: z.string().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json()
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const existing = await prisma.serviceRequest.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Service request not found" }, { status: 404 })
  }

  const updated = await prisma.serviceRequest.update({
    where: { id },
    data: {
      ...(parsed.data.status && { status: parsed.data.status }),
      ...(parsed.data.adminNotes !== undefined && { adminNotes: parsed.data.adminNotes }),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(updated)
}
