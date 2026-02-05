import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { AnalyticsCards } from "@/components/admin/analytics-cards"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentPurchases, RecentWebhooks } from "@/components/admin/recent-activity"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ShieldCheck, FileText } from "lucide-react"

interface ProductSalesStat {
  productId: string
  productName: string
  totalRevenue: number
  salesCount: number
}

async function getAdminDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalRevenueAllTime,
    totalRevenueThisMonth,
    activeCustomers,
    totalProducts,
    recentPurchases,
    recentWebhooks,
    completedPurchases,
    activeSubscriptions,
    expiredSubscriptions,
    totalContentItems,
    refundCount,
    totalPurchases,
  ] = await Promise.all([
    // Total revenue (all time)
    prisma.purchase.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),

    // Total revenue (this month)
    prisma.purchase.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),

    // Active customers (distinct users with active access)
    prisma.productAccess.findMany({
      where: { status: "ACTIVE" },
      select: { userId: true },
      distinct: ["userId"],
    }),

    // Total products
    prisma.product.count(),

    // Recent purchases (last 10)
    prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true } },
      },
    }),

    // Recent webhook events (last 10)
    prisma.webhookLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    // All completed purchases for product breakdown
    prisma.purchase.findMany({
      where: { status: "COMPLETED" },
      include: { product: { select: { id: true, name: true } } },
    }),

    // Active subscriptions count
    prisma.productAccess.count({
      where: { status: "ACTIVE", accessType: "SUBSCRIPTION" },
    }),

    // Expired subscriptions count
    prisma.productAccess.count({
      where: { status: "EXPIRED", accessType: "SUBSCRIPTION" },
    }),

    // Total content items
    prisma.contentItem.count(),

    // Refund count
    prisma.purchase.count({
      where: { status: "REFUNDED" },
    }),

    // Total purchases (completed + refunded)
    prisma.purchase.count({
      where: { status: { in: ["COMPLETED", "REFUNDED"] } },
    }),
  ])

  // Aggregate product sales stats
  const productMap = new Map<string, ProductSalesStat>()
  for (const purchase of completedPurchases) {
    const existing = productMap.get(purchase.productId)
    if (existing) {
      existing.totalRevenue += purchase.amount
      existing.salesCount += 1
    } else {
      productMap.set(purchase.productId, {
        productId: purchase.productId,
        productName: purchase.product.name,
        totalRevenue: purchase.amount,
        salesCount: 1,
      })
    }
  }
  const productStats: ProductSalesStat[] = Array.from(productMap.values()).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  )

  return {
    totalRevenueAllTime: totalRevenueAllTime._sum.amount || 0,
    totalRevenueThisMonth: totalRevenueThisMonth._sum.amount || 0,
    activeCustomers: activeCustomers.length,
    totalProducts,
    recentPurchases,
    recentWebhooks,
    productStats,
    activeSubscriptions,
    expiredSubscriptions,
    totalContentItems,
    refundCount,
    totalPurchases,
  }
}

async function AdminDashboardContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const data = await getAdminDashboardData()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your platform, products, and customers
          </p>
        </div>

        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button size="sm" className="group relative overflow-hidden">
              <span className="relative flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Product
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </Link>
          <Link href="/admin/access">
            <Button size="sm" variant="outline">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Grant Access
            </Button>
          </Link>
          <Link href="/admin/webhooks">
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Logs
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards
        totalRevenueAllTime={data.totalRevenueAllTime}
        totalRevenueThisMonth={data.totalRevenueThisMonth}
        activeCustomers={data.activeCustomers}
        totalProducts={data.totalProducts}
        activeSubscriptions={data.activeSubscriptions}
        expiredSubscriptions={data.expiredSubscriptions}
        totalContentItems={data.totalContentItems}
        refundCount={data.refundCount}
        totalPurchases={data.totalPurchases}
      />

      {/* Revenue Chart */}
      <RevenueChart productStats={data.productStats} />

      {/* Recent Activity — two columns on large screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentPurchases purchases={data.recentPurchases} />
        <RecentWebhooks webhooks={data.recentWebhooks} />
      </div>
    </div>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardContent />
      </Suspense>
    </div>
  )
}
