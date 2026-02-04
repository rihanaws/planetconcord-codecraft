"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Download } from "lucide-react"

interface ProductOption {
  id: string
  name: string
}

interface PurchaseFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  productFilter: string
  onProductChange: (value: string) => void
  products: ProductOption[]
  onExport: () => void
  resultCount: number
  totalCount: number
}

export function PurchaseFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  productFilter,
  onProductChange,
  products,
  onExport,
  resultCount,
  totalCount,
}: PurchaseFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search purchases..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          {/* Product filter */}
          <Select value={productFilter} onValueChange={onProductChange}>
            <SelectTrigger>
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export */}
          <Button variant="outline" onClick={onExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {resultCount} of {totalCount} purchases
      </p>
    </div>
  )
}
