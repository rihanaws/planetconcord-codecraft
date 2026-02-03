"use client"

import { useState, useMemo } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilter } from "@/components/products/product-filter"
import type { Product } from "@prisma/client"

interface ProductsContentProps {
  initialProducts: Product[]
}

export function ProductsContent({ initialProducts }: ProductsContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState("newest")

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDesc?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Sort
    switch (selectedSort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "popular":
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
        break
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [initialProducts, searchQuery, selectedCategory, selectedSort])

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Filters */}
        <ProductFilter
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSelectedSort}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
        />

        {/* Products grid */}
        <ProductGrid products={filteredProducts} />

        {/* Results count */}
        {filteredProducts.length > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-8">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </div>
        )}
      </div>
    </section>
  )
}
