import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { WebhookLogTable } from "@/components/admin/webhook-log-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getWebhooks() {
  return await prisma.webhookLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  })
}

async function WebhooksContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/webhooks")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const rawWebhooks = await getWebhooks()

  // Normalize payload: JsonValue can be null, component expects Record<string, unknown>
  const webhooks = rawWebhooks.map((w) => ({
    ...w,
    payload: (w.payload as Record<string, unknown>) ?? {},
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Webhook Logs</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and retry Whop webhook events
        </p>
      </div>

      <WebhookLogTable webhooks={webhooks} />
    </div>
  )
}

function WebhooksSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function WebhooksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<WebhooksSkeleton />}>
        <WebhooksContent />
      </Suspense>
    </div>
  )
}
