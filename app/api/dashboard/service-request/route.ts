import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const createServiceRequestSchema = z.object({
  shopifyUrl: z.string().url("Must be a valid URL"),
  notes: z.string().optional(),
  mustKeepApps: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Access gate: must have ACTIVE access to shopify-speed-surge
  const product = await prisma.product.findUnique({ where: { slug: "shopify-speed-surge" } })
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const access = await prisma.productAccess.findFirst({
    where: { userId: session.user.id, productId: product.id, status: "ACTIVE" },
  })
  if (!access) {
    return NextResponse.json({ error: "Active access required" }, { status: 403 })
  }

  const body: unknown = await request.json()
  const parsed = createServiceRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      shopifyUrl: parsed.data.shopifyUrl,
      notes: parsed.data.notes || null,
      mustKeepApps: parsed.data.mustKeepApps || null,
      status: "PENDING",
    },
  })

  return NextResponse.json(serviceRequest, { status: 201 })
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const requests = await prisma.serviceRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
    },
  })

  return NextResponse.json(requests)
}
