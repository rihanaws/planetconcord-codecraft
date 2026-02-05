import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const product = await prisma.product.findUnique({ where: { slug: "realestate-ai-video-review" } })
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const analyses = await prisma.videoAnalysis.findMany({
    where: { userId: session.user.id, productId: product.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(analyses)
}
