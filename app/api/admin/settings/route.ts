import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

const ALLOWED_KEYS = ["whop_api_key", "whop_webhook_secret", "whop_company_id"]

const upsertSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const settings = await prisma.appSetting.findMany({
      where: { key: { in: ALLOWED_KEYS } },
    })

    // Return as key-value map
    const settingsMap: Record<string, string> = {}
    for (const s of settings) {
      settingsMap[s.key] = s.value
    }

    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error("Admin settings GET error:", error)
    Sentry.captureException(error, { tags: { route: "admin/settings", method: "GET" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = upsertSettingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { key, value } = parsed.data

    if (!ALLOWED_KEYS.includes(key)) {
      return NextResponse.json({ error: "Invalid setting key" }, { status: 400 })
    }

    const setting = await prisma.appSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Admin settings PUT error:", error)
    Sentry.captureException(error, { tags: { route: "admin/settings", method: "PUT" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
