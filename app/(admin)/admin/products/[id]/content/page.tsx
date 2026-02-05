import { Suspense } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { ContentItemList } from "@/components/admin/content-item-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

async function getProductWithContent(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      contentItems: { orderBy: { order: "asc" } },
    },
  })
}

async function ContentManagementContent({ id }: { id: string }) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/products")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const product = await getProductWithContent(id)

  if (!product) {
    redirect("/admin/products")
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="mt-0.5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-1">
            Manage content items · {product.contentItems.length} item{product.contentItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Product summary card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-chart-1/10 to-transparent opacity-50" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-chart-1/10">
              <span className="font-mono text-sm font-semibold text-chart-1">${product.price.toFixed(2)}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{product.category}</p>
              <p className="text-xs text-muted-foreground font-mono">{product.slug}</p>
            </div>
          </div>
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button variant="outline" size="sm">Edit Product</Button>
          </Link>
        </div>
      </div>

      {/* Content Items */}
      <ContentItemList productId={product.id} initialItems={product.contentItems} />
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-48 mt-1" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Suspense fallback={<ContentSkeleton />}>
        <ContentManagementContent id={id} />
      </Suspense>
    </div>
  )
}
