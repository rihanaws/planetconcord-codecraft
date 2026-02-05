"use client"

import { ExternalLink, Check, Tag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { getProductImageUrl } from "@/lib/product-images"
import type { Product } from "@prisma/client"

interface ProductHeroProps {
  product: Product
}

export function ProductHero({ product }: ProductHeroProps) {
  // Parse deliverables from JSON string
  const deliverables = product.deliverables
    ? (typeof product.deliverables === 'string'
        ? JSON.parse(product.deliverables)
        : product.deliverables)
    : []

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-background via-muted/20 to-background" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Product image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-linear-to-br from-muted/50 to-muted/20 shadow-2xl shadow-primary/10">
              {/* Product image or fallback gradient */}
              {(() => {
                const imgUrl = getProductImageUrl(product.slug)
                return imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-accent/20 to-primary/10" />
                )
              })()}

              {/* Subtle glass overlay for depth */}
              <div className="absolute inset-0 bg-card/5 backdrop-blur-[1px]" />

              {/* Border glow */}
              <div className="absolute inset-0 rounded-2xl border border-border/50" />
            </div>

            {/* Floating badges */}
            {product.featured && (
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-primary backdrop-blur-sm border border-primary/20 shadow-xl shadow-primary/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                  <span className="text-sm font-semibold text-primary-foreground">Featured</span>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Product info */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium capitalize">{product.category}</span>
            </div>

            {/* Product name */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {product.name}
                </span>
              </h1>
            </div>

            {/* Short description */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {product.shortDesc}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4">
              <div className="text-5xl font-bold bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                {formatPrice(product.price, product.pricingType)}
              </div>
              {product.pricingType === "SUBSCRIPTION" && (
                <div className="text-lg text-muted-foreground">per month</div>
              )}
            </div>

            {/* Deliverables */}
            {deliverables.length > 0 && (
              <div className="space-y-3 py-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3">
                  {deliverables.slice(0, 4).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all duration-200" />
                          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </div>
                      <span className="text-base text-foreground/90 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href={product.whopCheckoutUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="group h-14 px-8 text-base relative overflow-hidden shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative font-semibold">Buy Now on Whop</span>
                  <ExternalLink className="ml-2 h-5 w-5 relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </a>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Instant access</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>30-day guarantee</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Lifetime updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
