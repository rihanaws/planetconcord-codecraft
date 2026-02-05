import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { ProductAccessGrid } from "@/components/dashboard/product-access-grid"
import { Skeleton } from "@/components/ui/skeleton"

async function MyProductsContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/products")
  }

  const productAccesses = await prisma.productAccess.findMany({
    where: { userId: session.user.id },
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
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My Products</h1>
        <p className="text-muted-foreground mt-2">
          Access and manage your purchased products
        </p>
      </div>

      <ProductAccessGrid productAccesses={productAccesses} />
    </div>
  )
}

function MyProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80 mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}

export default function MyProductsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<MyProductsSkeleton />}>
        <MyProductsContent />
      </Suspense>
    </div>
  )
}
