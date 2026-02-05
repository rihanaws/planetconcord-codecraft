import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { put } from "@vercel/blob"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const existing = await prisma.serviceRequest.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Service request not found" }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 })
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be 50MB or less" }, { status: 400 })
  }

  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")

  const blob = await put(`service-requests/${id}/${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  })

  await prisma.serviceRequest.update({
    where: { id },
    data: {
      reportUrl: blob.url,
      reportFileName: file.name,
    },
  })

  return NextResponse.json({ url: blob.url, reportFileName: file.name })
}
