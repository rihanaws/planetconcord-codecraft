import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

const whopMappingSchema = z.object({
  whopProductId: z.string().optional().nullable(),
  whopCheckoutUrl: z.string().optional().nullable(),
})

export async function PATCH(
  request: NextRequest,
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

    const body: unknown = await request.json()
    const parsed = whopMappingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        whopProductId: parsed.data.whopProductId ?? null,
        whopCheckoutUrl: parsed.data.whopCheckoutUrl ?? null,
      },
      select: { id: true, name: true, whopProductId: true, whopCheckoutUrl: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin product whop update error:", error)
    Sentry.captureException(error, { tags: { route: "admin/products/whop", method: "PATCH" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
