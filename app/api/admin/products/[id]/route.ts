import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole, PricingType } from "@prisma/client"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

// --- GET /api/admin/products/:id ---

export async function GET(
  _request: Request,
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        contentItems: { orderBy: { order: "asc" } },
        _count: {
          select: {
            productAccess: true,
            purchases: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Admin product GET error:", error)
    Sentry.captureException(error, { tags: { route: "admin/products/[id]", method: "GET" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// --- PUT /api/admin/products/:id ---

const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  description: z.string().min(1, "Description is required"),
  shortDesc: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  pricingType: z.enum(["ONE_TIME", "SUBSCRIPTION"]),
  category: z.string().min(1, "Category is required"),
  whopProductId: z.string().optional(),
  whopCheckoutUrl: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  discordInviteUrl: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  deliverables: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
})

export async function PUT(
  request: Request,
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

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const body: unknown = await request.json()
    const parsed = updateProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Check slug uniqueness (excluding current product)
    if (data.slug !== product.slug) {
      const existing = await prisma.product.findUnique({ where: { slug: data.slug } })
      if (existing) {
        return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 })
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc || null,
        price: data.price,
        pricingType: data.pricingType as PricingType,
        category: data.category,
        whopProductId: data.whopProductId || null,
        whopCheckoutUrl: data.whopCheckoutUrl || null,
        discordInviteUrl: data.discordInviteUrl || null,
        deliverables: data.deliverables ?? undefined,
        features: data.features ?? undefined,
        requirements: data.requirements ?? undefined,
        faq: data.faq ?? undefined,
        image: data.image || null,
        featured: data.featured ?? product.featured,
        popular: data.popular ?? product.popular,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin product PUT error:", error)
    Sentry.captureException(error, { tags: { route: "admin/products/[id]", method: "PUT" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// --- DELETE /api/admin/products/:id ---

export async function DELETE(
  _request: Request,
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

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete cascades via Prisma schema (contentItems, productAccess, purchases)
    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Admin product DELETE error:", error)
    Sentry.captureException(error, { tags: { route: "admin/products/[id]", method: "DELETE" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
