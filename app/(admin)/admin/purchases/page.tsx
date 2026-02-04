import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { PurchaseTable } from "@/components/admin/purchase-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getPurchaseData() {
  const [purchases, products] = await Promise.all([
    prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  return { purchases, products }
}

async function PurchasesContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/purchases")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const data = await getPurchaseData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Purchase Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all customer purchases and transactions
        </p>
      </div>

      <PurchaseTable purchases={data.purchases} products={data.products} />
    </div>
  )
}

function PurchasesSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 mt-2" />
      </div>
      <Skeleton className="h-24 w-full" />
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
