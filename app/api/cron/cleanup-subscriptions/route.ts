/**
 * Cron: Expired subscription cleanup + 3-day renewal reminder
 * 1. Finds ProductAccess rows where expiresAt < now and status is still ACTIVE,
 *    transitions them to EXPIRED, and sends a subscription-expiring email.
 * 2. Finds ProductAccess rows expiring in ~3 days and sends a renewal reminder.
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
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  let expired = 0
  let emailsSent = 0
  let remindersSent = 0
  let errors = 0

  try {
    // --- Part 1: Expire stale subscriptions ---
    const staleAccess = await prisma.productAccess.findMany({
      where: {
        status: AccessStatus.ACTIVE,
        expiresAt: { lt: now },
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        product: { select: { id: true, name: true, slug: true, price: true } },
      },
    })

    for (const access of staleAccess) {
      try {
        await prisma.productAccess.update({
          where: { id: access.id },
          data: {
            status: AccessStatus.EXPIRED,
            revokedAt: now,
          },
        })
        expired++

        try {
          const renewUrl = `${process.env.NEXTAUTH_URL}/products/${access.product.slug}`
          const expiryDate = (access.expiresAt ?? now).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )

          await sendSubscriptionExpiringEmail(
            access.user.email,
            access.user.name || "Valued Customer",
            access.product.name,
            expiryDate,
            renewUrl,
            String(access.product.price)
          )
          emailsSent++
        } catch (emailError) {
          console.error(
            `Email failed for user ${access.user.id}:`,
            emailError
          )
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

    // --- Part 2: 3-day-before renewal reminders ---
    // Find subscriptions expiring between 2.5 and 3.5 days from now
    const reminderStart = new Date(now.getTime() + 2.5 * 24 * 60 * 60 * 1000)
    const reminderEnd = new Date(now.getTime() + 3.5 * 24 * 60 * 60 * 1000)

    const upcomingExpiry = await prisma.productAccess.findMany({
      where: {
        status: AccessStatus.ACTIVE,
        expiresAt: {
          gte: reminderStart,
          lte: reminderEnd,
        },
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        product: { select: { id: true, name: true, slug: true, price: true } },
      },
    })

    for (const access of upcomingExpiry) {
      try {
        const renewUrl = `${process.env.NEXTAUTH_URL}/products/${access.product.slug}`
        const expiryDate = (access.expiresAt ?? now).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "long", day: "numeric" }
        )

        await sendSubscriptionExpiringEmail(
          access.user.email,
          access.user.name || "Valued Customer",
          access.product.name,
          expiryDate,
          renewUrl,
          String(access.product.price)
        )
        remindersSent++
      } catch (emailError) {
        errors++
        console.error(
          `Reminder email failed for user ${access.user.id}:`,
          emailError
        )
        Sentry.captureException(emailError, {
          tags: {
            cron: "cleanup-subscriptions-reminder",
            userId: access.user.id,
          },
        })
      }
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { cron: "cleanup-subscriptions" } })
    return NextResponse.json(
      {
        error: "Internal error",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    )
  }

  console.log(
    `[cron:cleanup-subscriptions] expired=${expired} emailsSent=${emailsSent} remindersSent=${remindersSent} errors=${errors}`
  )

  return NextResponse.json({
    expired,
    emailsSent,
    remindersSent,
    errors,
    runAt: now.toISOString(),
  })
}
