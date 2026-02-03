"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Package,
  Calendar,
  FileText,
  ShoppingBag,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type ProductAccess = {
  id: string
  status: string
  accessType: string
  grantedAt: Date
  expiresAt: Date | null
  product: {
    id: string
    name: string
    slug: string
    description: string
    category: string
    _count: {
      contentItems: number
    }
  }
}

interface ProductAccessGridProps {
  productAccesses: ProductAccess[]
}

export function ProductAccessGrid({ productAccesses }: ProductAccessGridProps) {
  const [now] = useState(() => Date.now())

  if (productAccesses.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-12 text-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />

        <div className="relative space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Products Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              You haven&apos;t purchased any products yet. Browse our collection to get started.
            </p>
          </div>
          <Link href="/products">
            <Button className="group relative overflow-hidden mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <ShoppingBag className="h-4 w-4 mr-2 relative" />
              <span className="relative">Browse Products</span>
              <ArrowRight className="h-4 w-4 ml-2 relative transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {productAccesses.map((access) => {
        const isActive = access.status === "ACTIVE"
        const isExpiring =
          access.expiresAt &&
          new Date(access.expiresAt).getTime() - now < 7 * 24 * 60 * 60 * 1000

        return (
          <div
            key={access.id}
            className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />

            <div className="relative p-6 space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {access.product.name}
                  </h3>
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {access.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {access.product.description}
                </p>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{access.product._count.contentItems} items</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {formatDistanceToNow(new Date(access.grantedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Expiration warning */}
              {isExpiring && access.expiresAt && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium">
                    Expires{" "}
                    {formatDistanceToNow(new Date(access.expiresAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              )}

              {/* Action button */}
              {isActive ? (
                <Link href={`/dashboard/products/${access.product.slug}`}>
                  <Button
                    className="w-full group relative overflow-hidden"
                    variant="default"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative">Access Content</span>
                    <ArrowRight className="h-4 w-4 ml-2 relative transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Access Expired
                </Button>
              )}
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          </div>
        )
      })}
    </div>
  )
}
