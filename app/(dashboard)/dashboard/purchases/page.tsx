import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { PurchaseHistoryTable } from "@/components/dashboard/purchase-history-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getPurchases(userId: string) {
  return await prisma.purchase.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

async function PurchasesContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/purchases")
  }

  const purchases = await getPurchases(session.user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Purchase History</h1>
        <p className="text-muted-foreground mt-2">
          View all your past purchases and transactions
        </p>
      </div>

      {/* Purchases table */}
      <PurchaseHistoryTable purchases={purchases} />
    </div>
  )
}

function PurchasesSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function PurchasesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<PurchasesSkeleton />}>
        <PurchasesContent />
      </Suspense>
    </div>
  )
}
