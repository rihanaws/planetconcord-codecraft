import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

// --- PUT /api/admin/news/:id ---

const updateNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Body is required"),
  productId: z.string().optional(),
  published: z.boolean(),
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

  const existing = await prisma.newsItem.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "News item not found" }, { status: 404 })
  }

  const body: unknown = await request.json()
  const parsed = updateNewsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Validate productId if provided
  if (data.productId) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
  }

  const updated = await prisma.newsItem.update({
    where: { id },
    data: {
      title: data.title,
      body: data.body,
      productId: data.productId || null,
      published: data.published,
    },
    include: {
      product: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(updated)
}

// --- DELETE /api/admin/news/:id ---

export async function DELETE(
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

  const existing = await prisma.newsItem.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "News item not found" }, { status: 404 })
  }

  await prisma.newsItem.delete({ where: { id } })

  return NextResponse.json({ message: "News item deleted successfully" })
}
