import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { SettingsForm } from "@/components/admin/settings-form"
import { WebhookEndpoints } from "@/components/admin/webhook-endpoints"
import { ProductWhopMapping } from "@/components/admin/product-whop-mapping"
import { Skeleton } from "@/components/ui/skeleton"

async function getSettingsData() {
  const [settings, products] = await Promise.all([
    prisma.appSetting.findMany({
      where: { key: { in: ["whop_api_key", "whop_webhook_secret", "whop_company_id"] } },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, whopProductId: true, whopCheckoutUrl: true },
    }),
  ])

  const settingsMap: Record<string, string> = {}
  for (const s of settings) {
    settingsMap[s.key] = s.value
  }

  return { settings: settingsMap, products }
}

async function SettingsContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/settings")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const data = await getSettingsData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage Whop credentials, webhook endpoints, and product integrations
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <SettingsForm initialSettings={data.settings} />
        <WebhookEndpoints />
      </div>

      <ProductWhopMapping products={data.products} />
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
