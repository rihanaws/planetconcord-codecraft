import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contentItemId: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { contentItemId } = await params

  // Look up the content item and its product
  const contentItem = await prisma.contentItem.findUnique({
    where: { id: contentItemId },
    select: {
      fileUrl: true,
      fileName: true,
      type: true,
      productId: true,
    },
  })

  if (!contentItem || contentItem.type !== "FILE" || !contentItem.fileUrl) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  // Verify the user has active access to this product
  const access = await prisma.productAccess.findFirst({
    where: {
      userId: session.user.id,
      productId: contentItem.productId,
      status: "ACTIVE",
    },
  })

  if (!access) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }

  // Fetch the file from Vercel Blob and stream it back
  const blobResponse = await fetch(contentItem.fileUrl)

  if (!blobResponse.ok) {
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 502 })
  }

  const contentType = blobResponse.headers.get("content-type") || "application/octet-stream"
  const fileName = contentItem.fileName || "download"

  return new NextResponse(blobResponse.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
