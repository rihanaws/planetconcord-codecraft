import { ProductCard } from "./product-card"
import type { Product } from "@prisma/client"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
