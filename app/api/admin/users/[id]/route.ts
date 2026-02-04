import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

// --- GET /api/admin/users/:id  (full detail for modal) ---

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      purchases: {
        include: { product: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      productAccess: {
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { grantedAt: "desc" },
      },
      accounts: { select: { provider: true, providerAccountId: true } },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

// --- PUT /api/admin/users/:id  (update role / deactivate) ---

const updateUserSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN"]).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  // Prevent changing own role
  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot modify your own role" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body: unknown = await request.json()
  const parsed = updateUserSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      role: parsed.data.role as UserRole | undefined,
    },
  })

  return NextResponse.json({ id: updated.id, role: updated.role, email: updated.email })
}
