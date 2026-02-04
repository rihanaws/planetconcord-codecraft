import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { ProductTable } from "@/components/admin/product-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          contentItems: true,
          productAccess: true,
          purchases: true,
        },
      },
    },
  })
}

async function ProductsContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/products")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Product Management</h1>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage your digital products
        </p>
      </div>

      <ProductTable products={products} />
    </div>
  )
}

function ProductsSkeleton() {
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

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent />
      </Suspense>
    </div>
  )
}
