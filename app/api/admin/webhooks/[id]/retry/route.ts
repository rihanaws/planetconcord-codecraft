import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { handleWhopWebhook } from "@/lib/whop/webhook-handler"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  const webhookLog = await prisma.webhookLog.findUnique({ where: { id } })
  if (!webhookLog) {
    return NextResponse.json({ error: "Webhook log not found" }, { status: 404 })
  }

  try {
    // Re-process the stored payload (contains 'type' field inside)
    await handleWhopWebhook(webhookLog.payload as Record<string, unknown>)

    // Update the log entry
    await prisma.webhookLog.update({
      where: { id },
      data: {
        processed: true,
        success: true,
        error: null,
      },
    })

    return NextResponse.json({ message: "Webhook retried successfully", success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error during retry"

    await prisma.webhookLog.update({
      where: { id },
      data: {
        processed: true,
        success: false,
        error: errorMessage,
      },
    })

    return NextResponse.json({ message: "Retry failed", error: errorMessage, success: false }, { status: 500 })
  }
}
