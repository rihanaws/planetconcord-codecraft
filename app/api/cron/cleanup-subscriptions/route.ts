/**
 * Cron: Expired subscription cleanup
 * Finds ProductAccess rows where expiresAt < now and status is still ACTIVE,
 * transitions them to EXPIRED, and sends a subscription-expiring email.
 *
 * Schedule: every 6 hours (vercel.json)
 * Auth: CRON_SECRET header required
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { AccessStatus } from "@prisma/client"
import { sendSubscriptionExpiringEmail } from "@/lib/email/send"
import * as Sentry from "@sentry/nextjs"

export async function GET(req: NextRequest) {
  // Vercel cron jobs send the secret as an Authorization: Bearer header
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  let expired = 0
  let emailsSent = 0
  let errors = 0

  try {
    // Find all active subscriptions that have passed their expiry date
    const staleAccess = await prisma.productAccess.findMany({
      where: {
        status: AccessStatus.ACTIVE,
        expiresAt: { lt: now },
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })

    for (const access of staleAccess) {
      try {
        // Mark as expired
        await prisma.productAccess.update({
          where: { id: access.id },
          data: {
            status: AccessStatus.EXPIRED,
            revokedAt: now,
          },
        })
        expired++

        // Send expiry notification email
        try {
          const renewUrl = `${process.env.NEXTAUTH_URL}/products/${access.product.slug}`
          const expiryDate = (access.expiresAt ?? now).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          await sendSubscriptionExpiringEmail(
            access.user.email,
            access.user.name || "Valued Customer",
            access.product.name,
            expiryDate,
            renewUrl
          )
          emailsSent++
        } catch (emailError) {
          // Email failure is non-critical — access is already expired
          console.error(`Email failed for user ${access.user.id}:`, emailError)
          Sentry.captureException(emailError, {
            tags: { cron: "cleanup-subscriptions", userId: access.user.id },
          })
        }
      } catch (updateError) {
        errors++
        console.error(`Failed to expire access ${access.id}:`, updateError)
        Sentry.captureException(updateError, {
          tags: { cron: "cleanup-subscriptions", accessId: access.id },
        })
      }
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { cron: "cleanup-subscriptions" } })
    return NextResponse.json(
      { error: "Internal error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }

  console.log(`[cron:cleanup-subscriptions] expired=${expired} emailsSent=${emailsSent} errors=${errors}`)

  return NextResponse.json({ expired, emailsSent, errors, runAt: now.toISOString() })
}
