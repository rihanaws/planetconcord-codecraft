import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole, PricingType } from "@prisma/client"
import { z } from "zod"

// --- GET /api/admin/products ---

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          contentItems: true,
          productAccess: true,
          purchases: true,
        },
      },
    },
  })

  return NextResponse.json(products)
}

// --- POST /api/admin/products ---

const createProductSchema = z.object({
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

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json()
  const parsed = createProductSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } })
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 })
  }

  const product = await prisma.product.create({
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
      featured: data.featured ?? false,
      popular: data.popular ?? false,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
