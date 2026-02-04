import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole, ContentType } from "@prisma/client"
import { z } from "zod"

// --- POST /api/admin/content ---

const createContentSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  type: z.enum(["FILE", "LINK", "TEXT", "VIDEO"]),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  linkUrl: z.string().url("Must be a valid URL").optional(),
  textContent: z.string().optional(),
  videoUrl: z.string().optional(),
  order: z.number().optional(),
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
  const parsed = createContentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Verify product exists
  const product = await prisma.product.findUnique({ where: { id: data.productId } })
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Validate type-specific fields
  if (data.type === "FILE" && !data.fileUrl) {
    return NextResponse.json({ error: "File URL is required for FILE type" }, { status: 400 })
  }
  if (data.type === "LINK" && !data.linkUrl) {
    return NextResponse.json({ error: "Link URL is required for LINK type" }, { status: 400 })
  }
  if (data.type === "TEXT" && !data.textContent) {
    return NextResponse.json({ error: "Text content is required for TEXT type" }, { status: 400 })
  }
  if (data.type === "VIDEO" && !data.videoUrl) {
    return NextResponse.json({ error: "Video URL is required for VIDEO type" }, { status: 400 })
  }

  // Determine next order if not specified
  let order = data.order
  if (order === undefined) {
    const maxOrder = await prisma.contentItem.aggregate({
      where: { productId: data.productId },
      _max: { order: true },
    })
    order = (maxOrder._max.order || 0) + 1
  }

  const contentItem = await prisma.contentItem.create({
    data: {
      productId: data.productId,
      type: data.type as ContentType,
      title: data.title,
      description: data.description || null,
      fileUrl: data.fileUrl || null,
      fileName: data.fileName || null,
      fileSize: data.fileSize || null,
      linkUrl: data.linkUrl || null,
      textContent: data.textContent || null,
      videoUrl: data.videoUrl || null,
      order,
    },
  })

  return NextResponse.json(contentItem, { status: 201 })
}

// --- PUT /api/admin/content ---
// Update existing content item. Expects { id, ...fields }

const updateContentSchema = z.object({
  id: z.string().min(1, "Content item ID is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  linkUrl: z.string().url("Must be a valid URL").optional(),
  textContent: z.string().optional(),
  videoUrl: z.string().optional(),
  order: z.number().optional(),
})

export async function PUT(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json()
  const parsed = updateContentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const data = parsed.data

  const existing = await prisma.contentItem.findUnique({ where: { id: data.id } })
  if (!existing) {
    return NextResponse.json({ error: "Content item not found" }, { status: 404 })
  }

  const updated = await prisma.contentItem.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description ?? existing.description,
      fileUrl: data.fileUrl ?? existing.fileUrl,
      fileName: data.fileName ?? existing.fileName,
      fileSize: data.fileSize ?? existing.fileSize,
      linkUrl: data.linkUrl ?? existing.linkUrl,
      textContent: data.textContent ?? existing.textContent,
      videoUrl: data.videoUrl ?? existing.videoUrl,
      order: data.order ?? existing.order,
    },
  })

  return NextResponse.json(updated)
}

// --- DELETE /api/admin/content ---
// Body: { id }

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: { id?: string } = await request.json()

  if (!body.id) {
    return NextResponse.json({ error: "Content item ID is required" }, { status: 400 })
  }

  const existing = await prisma.contentItem.findUnique({ where: { id: body.id } })
  if (!existing) {
    return NextResponse.json({ error: "Content item not found" }, { status: 404 })
  }

  await prisma.contentItem.delete({ where: { id: body.id } })

  return NextResponse.json({ message: "Content item deleted successfully" })
}
