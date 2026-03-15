/**
 * Cron: Post-purchase check-in email
 * Finds completed purchases from ~2 days ago that haven't received a check-in email,
 * and sends a follow-up to prevent disputes and improve engagement.
 *
 * Schedule: daily at 10 AM UTC (vercel.json)
 * Auth: CRON_SECRET header required
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { PurchaseStatus } from "@prisma/client"
import { sendPostPurchaseCheckinEmail } from "@/lib/email/send"
import * as Sentry from "@sentry/nextjs"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  let emailsSent = 0
  let errors = 0

  try {
    // Send to purchases 47h–7 days old that haven't received a check-in yet.
    // Lower bound (47h): never send before 2 days have passed.
    // Upper bound (7 days): backfill purchases whose window was missed (e.g. cron
    // deployed after their 47-49h target, or a cron run was skipped).
    const windowEnd = new Date(now.getTime() - 47 * 60 * 60 * 1000)
    const backfillStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const purchases = await prisma.purchase.findMany({
      where: {
        status: PurchaseStatus.COMPLETED,
        completedAt: {
          gte: backfillStart,
          lte: windowEnd, // never send before 47h have passed
        },
        checkinSentAt: null, // Not yet sent
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })

    for (const purchase of purchases) {
      try {
        const productUrl = `${process.env.NEXTAUTH_URL}/dashboard/products/${purchase.product.slug}`

        await sendPostPurchaseCheckinEmail(
          purchase.user.email,
          purchase.user.name || "Valued Customer",
          purchase.product.name,
          productUrl,
          String(purchase.amount)
        )

        // Mark as sent
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { checkinSentAt: now },
        })

        emailsSent++
      } catch (emailError) {
        errors++
        console.error(
          `Check-in email failed for purchase ${purchase.id}:`,
          emailError
        )
        Sentry.captureException(emailError, {
          tags: { cron: "post-purchase-checkin", purchaseId: purchase.id },
        })
      }
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { cron: "post-purchase-checkin" },
    })
    return NextResponse.json(
      {
        error: "Internal error",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    )
  }

  console.log(
    `[cron:post-purchase-checkin] emailsSent=${emailsSent} errors=${errors}`
  )

  return NextResponse.json({
    emailsSent,
    errors,
    runAt: now.toISOString(),
  })
}
