import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { getProductImageUrl } from "@/lib/product-images"
import type { Product } from "@prisma/client"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="group relative rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-border hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: "backwards",
        }}
      >
        {/* Image container */}
        <div className="relative aspect-[16/9] overflow-hidden bg-linear-to-br from-muted/50 to-muted/20">
          {/* Product image or fallback gradient */}
          {(() => {
            const imgUrl = getProductImageUrl(product.slug)
            return imgUrl ? (
              <Image
                src={imgUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-accent/10 to-primary/5" />
            )
          })()}

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg">
              <Tag className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium capitalize">{product.category}</span>
            </div>
          </div>

          {/* Featured/Popular badge */}
          {(product.featured || product.popular) && (
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm border border-primary/20 shadow-lg">
                <span className="text-xs font-semibold text-primary-foreground">
                  {product.featured ? "Featured" : "Popular"}
                </span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-card/90 via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-semibold tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {product.shortDesc}
          </p>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-2">
            {/* Price */}
            <div className="space-y-0.5">
              <div className="text-2xl font-bold bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                {formatPrice(product.price, product.pricingType)}
              </div>
              {product.pricingType === "SUBSCRIPTION" && (
                <div className="text-xs text-muted-foreground">
                  Billed monthly
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Button
              size="sm"
              className="group/btn relative overflow-hidden"
              asChild
            >
              <div>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative text-xs font-semibold">View Details</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 relative transition-transform group-hover/btn:translate-x-0.5" />
              </div>
            </Button>
          </div>
        </div>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </div>
    </Link>
  )
}
