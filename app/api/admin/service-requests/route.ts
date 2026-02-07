import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import * as Sentry from "@sentry/nextjs"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const url = new URL(request.url)
    const statusFilter = url.searchParams.get("status")

    const requests = await prisma.serviceRequest.findMany({
      where: statusFilter
        ? { status: statusFilter as "PENDING" | "IN_PROGRESS" | "COMPLETE" | "CANCELLED" }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Admin service-requests GET error:", error)
    Sentry.captureException(error, { tags: { route: "admin/service-requests" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
