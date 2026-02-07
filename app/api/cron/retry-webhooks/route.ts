/**
 * Cron: Webhook retry queue
 * Finds WebhookLog entries that were processed but failed (processed=true, success=false)
 * and were created within the last 24 hours, then re-runs the handler.
 * Logs that succeed on retry are updated to success=true and error cleared.
 *
 * Schedule: every 15 minutes (vercel.json)
 * Auth: CRON_SECRET header required
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { handleWhopWebhook } from "@/lib/whop/webhook-handler"
import { handlePayPalWebhook } from "@/lib/paypal/webhook-handler"
import * as Sentry from "@sentry/nextjs"

const RETRY_WINDOW_MS = 24 * 60 * 60 * 1000 // only retry within 24 hours
const MAX_RETRIES = 10 // cap per run to avoid timeouts

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const retryAfter = new Date(now.getTime() - RETRY_WINDOW_MS)

  let retried = 0
  let succeeded = 0
  let failed = 0

  try {
    const failedLogs = await prisma.webhookLog.findMany({
      where: {
        processed: true,
        success: false,
        createdAt: { gte: retryAfter },
      },
      orderBy: { createdAt: "asc" },
      take: MAX_RETRIES,
    })

    for (const log of failedLogs) {
      retried++
      try {
        const payload = log.payload as Record<string, unknown>
        const isPayPal = log.event.startsWith("PAYMENT.")
        if (isPayPal) {
          await handlePayPalWebhook(payload)
        } else {
          await handleWhopWebhook(payload)
        }

        // Mark as successful
        await prisma.webhookLog.update({
          where: { id: log.id },
          data: { success: true, error: null },
        })
        succeeded++
      } catch (retryError) {
        failed++
        const errorMsg = retryError instanceof Error ? retryError.message : "Unknown error"
        console.error(`[cron:retry-webhooks] retry failed for ${log.id}:`, retryError)

        // Update error message so it reflects the latest attempt
        await prisma.webhookLog.update({
          where: { id: log.id },
          data: { error: errorMsg },
        })

        Sentry.captureException(retryError, {
          tags: { cron: "retry-webhooks", webhookLogId: log.id, event: log.event },
        })
      }
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { cron: "retry-webhooks" } })
    return NextResponse.json(
      { error: "Internal error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }

  console.log(`[cron:retry-webhooks] retried=${retried} succeeded=${succeeded} failed=${failed}`)

  return NextResponse.json({ retried, succeeded, failed, runAt: now.toISOString() })
}
