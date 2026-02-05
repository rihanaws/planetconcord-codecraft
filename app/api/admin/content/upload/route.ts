import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { put } from "@vercel/blob"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File
  const productId = formData.get("productId") as string

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File size exceeds 50MB" }, { status: 400 })
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  })

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Sanitize filename: strip path traversal, collapse whitespace
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")

  const blob = await put(`products/${product.slug}/${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return NextResponse.json({
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
  })
}
