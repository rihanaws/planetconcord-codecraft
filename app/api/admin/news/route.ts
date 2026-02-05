import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

// --- GET /api/admin/news ---

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const newsItems = await prisma.newsItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(newsItems)
}

// --- POST /api/admin/news ---

const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Body is required"),
  productId: z.string().optional(),
  published: z.boolean().optional(),
})

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json()
  const parsed = createNewsSchema.safeParse(body)

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

  const newsItem = await prisma.newsItem.create({
    data: {
      title: data.title,
      body: data.body,
      productId: data.productId || null,
      published: data.published ?? false,
    },
    include: {
      product: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(newsItem, { status: 201 })
}
