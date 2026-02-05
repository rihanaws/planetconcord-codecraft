import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { NewsTable } from "@/components/admin/news-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getNewsData() {
  const [newsItems, products] = await Promise.all([
    prisma.newsItem.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  return { newsItems, products }
}

async function NewsContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/news")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const data = await getNewsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">News & Updates</h1>
        <p className="text-muted-foreground mt-2">
          Manage announcements and updates for your customers
        </p>
      </div>

      <NewsTable newsItems={data.newsItems} products={data.products} />
    </div>
  )
}

function NewsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72 mt-2" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<NewsSkeleton />}>
        <NewsContent />
      </Suspense>
    </div>
  )
}
