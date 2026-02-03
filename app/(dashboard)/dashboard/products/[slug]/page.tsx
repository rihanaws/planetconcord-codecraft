import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { ContentViewer } from "@/components/dashboard/content-viewer"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Calendar, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

async function getProductAccess(slug: string, userId: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      contentItems: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!product) {
    return null
  }

  const productAccess = await prisma.productAccess.findFirst({
    where: {
      userId,
      productId: product.id,
    },
  })

  return {
    product,
    productAccess,
  }
}

async function ProductAccessContent({ slug }: { slug: string }) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/products/" + slug)
  }

  const data = await getProductAccess(slug, session.user.id)

  if (!data) {
    notFound()
  }

  const { product, productAccess } = data

  // Check if user has access
  if (!productAccess) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="space-y-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="group">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="relative overflow-hidden rounded-2xl border border-destructive/50 bg-destructive/5 backdrop-blur-xl p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent" />
            <div className="relative space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Access Denied</h1>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  You don&apos;t have access to this product. Purchase it to unlock all content.
                </p>
              </div>
              <div className="flex gap-3 justify-center mt-6">
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isActive = productAccess.status === "ACTIVE"
  const isExpiring =
    productAccess.expiresAt &&
    new Date(productAccess.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="group">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {product.description}
              </p>
            </div>
            <Badge
              variant={isActive ? "default" : "destructive"}
              className="shrink-0"
            >
              {productAccess.status}
            </Badge>
          </div>

          {/* Access info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Granted{" "}
                {formatDistanceToNow(new Date(productAccess.grantedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {productAccess.expiresAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Expires{" "}
                  {formatDistanceToNow(new Date(productAccess.expiresAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Warnings */}
        {!isActive && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your access to this product has expired or been revoked. Please contact support if you think this is an error.
            </AlertDescription>
          </Alert>
        )}

        {isExpiring && productAccess.expiresAt && isActive && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your access will expire{" "}
              {formatDistanceToNow(new Date(productAccess.expiresAt), {
                addSuffix: true,
              })}
              . Renew your subscription to continue accessing this content.
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {isActive && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
              Course Content
            </h2>
            <ContentViewer contentItems={product.contentItems} />
          </div>
        )}
      </div>
    </div>
  )
}

function ProductAccessSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <div className="space-y-8">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

export default async function ProductAccessPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <Suspense fallback={<ProductAccessSkeleton />}>
      <ProductAccessContent slug={slug} />
    </Suspense>
  )
}
