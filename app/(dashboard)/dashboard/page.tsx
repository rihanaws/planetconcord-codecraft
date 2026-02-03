import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { DashboardStats } from "@/components/dashboard/stats-cards"
import { ProductAccessGrid } from "@/components/dashboard/product-access-grid"
import { RecentPurchases } from "@/components/dashboard/recent-purchases"
import { Skeleton } from "@/components/ui/skeleton"

async function getDashboardData(userId: string) {
  const [productAccesses, purchases, stats] = await Promise.all([
    // Get user's product accesses
    prisma.productAccess.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            _count: {
              select: { contentItems: true },
            },
          },
        },
      },
      orderBy: { grantedAt: "desc" },
    }),

    // Get recent purchases
    prisma.purchase.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    // Calculate stats
    prisma.$transaction(async (tx) => {
      const totalProducts = await tx.productAccess.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      })

      const activeSubscriptions = await tx.productAccess.count({
        where: {
          userId,
          status: "ACTIVE",
          accessType: "SUBSCRIPTION",
        },
      })

      const totalSpentResult = await tx.purchase.aggregate({
        where: {
          userId,
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
      })

      return {
        totalProducts,
        activeSubscriptions,
        totalSpent: totalSpentResult._sum.amount || 0,
      }
    }),
  ])

  return {
    productAccesses,
    purchases,
    stats,
  }
}

async function DashboardContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard")
  }

  const data = await getDashboardData(session.user.id)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, {session.user.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your products
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        totalProducts={data.stats.totalProducts}
        activeSubscriptions={data.stats.activeSubscriptions}
        totalSpent={data.stats.totalSpent}
      />

      {/* My Products Grid */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">My Products</h2>
        <ProductAccessGrid productAccesses={data.productAccesses} />
      </div>

      {/* Recent Purchases */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Recent Purchases</h2>
        <RecentPurchases purchases={data.purchases} />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
