import { prisma } from "@/lib/db/prisma"
import { Prisma } from "@prisma/client"

/**
 * Fire-and-forget activity logger. Never throws — safe to call without await.
 * Logs user actions to the UserActivity table for dispute evidence and analytics.
 */
export function logActivity(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
): void {
  prisma.userActivity
    .create({
      data: {
        userId,
        action,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    })
    .catch((err) => {
      console.error("[activity-logger] Failed to log activity:", err)
    })
}
