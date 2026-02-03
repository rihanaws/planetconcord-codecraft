"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PRODUCT_CATEGORIES } from "@/lib/constants"

interface ProductFilterProps {
  onSearch: (query: string) => void
  onCategoryChange: (category: string | null) => void
  onSortChange: (sort: string) => void
  selectedCategory: string | null
  selectedSort: string
}

const categories = [
  { value: null, label: "All Products" },
  { value: "marketing", label: "Marketing" },
  { value: "analytics", label: "Analytics" },
  { value: "development", label: "Development" },
]

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
]

export function ProductFilter({
  onSearch,
  onCategoryChange,
  onSortChange,
  selectedCategory,
  selectedSort,
}: ProductFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 h-12 bg-card/50 backdrop-blur-xl border-border/50 focus:border-border transition-all duration-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {categories.map((category) => (
            <Button
              key={category.label}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className={cn(
                "whitespace-nowrap transition-all duration-200",
                selectedCategory === category.value
                  ? "shadow-lg shadow-primary/20"
                  : "hover:bg-accent/50"
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 sm:flex-initial h-9 px-3 py-1 text-sm rounded-md border border-border/50 bg-card/50 backdrop-blur-xl focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all duration-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
