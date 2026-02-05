/**
 * Cron: Stale VideoAnalysis cleanup
 * Finds VideoAnalysis rows stuck in PENDING for longer than 5 minutes
 * and marks them as FAILED so the UI stops showing a spinner.
 *
 * Schedule: every 5 minutes (vercel.json)
 * Auth: CRON_SECRET header required
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { VideoAnalysisStatus } from "@prisma/client"
import * as Sentry from "@sentry/nextjs"

const STALE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const staleBefore = new Date(now.getTime() - STALE_THRESHOLD_MS)

  try {
    const { count } = await prisma.videoAnalysis.updateMany({
      where: {
        status: VideoAnalysisStatus.PENDING,
        createdAt: { lt: staleBefore },
      },
      data: {
        status: VideoAnalysisStatus.FAILED,
      },
    })

    console.log(`[cron:cleanup-video-analyses] failed=${count}`)

    return NextResponse.json({ failed: count, runAt: now.toISOString() })
  } catch (error) {
    Sentry.captureException(error, { tags: { cron: "cleanup-video-analyses" } })
    return NextResponse.json(
      { error: "Internal error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
