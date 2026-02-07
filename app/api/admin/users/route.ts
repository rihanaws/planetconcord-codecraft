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

    // Support optional pagination via ?page=1&limit=50
    const url = new URL(request.url)
    const pageParam = url.searchParams.get("page")
    const limitParam = url.searchParams.get("limit")

    if (pageParam || limitParam) {
      const page = Math.max(1, parseInt(pageParam || "1", 10))
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || "50", 10)))
      const skip = (page - 1) * limit

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            _count: {
              select: {
                purchases: true,
                productAccess: true,
              },
            },
          },
        }),
        prisma.user.count(),
      ])

      return NextResponse.json({
        data: users,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }

    // Default: return all (backward compatible)
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            purchases: true,
            productAccess: true,
          },
        },
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Admin users GET error:", error)
    Sentry.captureException(error, { tags: { route: "admin/users" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
