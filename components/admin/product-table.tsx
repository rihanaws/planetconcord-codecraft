"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2, FileText, ExternalLink, AlertTriangle, Check } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface ProductRow {
  id: string
  name: string
  slug: string
  price: number
  pricingType: string
  category: string
  featured: boolean
  popular: boolean
  deliverables: string[] | null
  createdAt: Date
  _count: {
    contentItems: number
    productAccess: number
    purchases: number
  }
}

interface ProductTableProps {
  products: ProductRow[]
}

export function ProductTable({ products: initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [pricingFilter, setPricingFilter] = useState<string>("ALL")
  const { toast } = useToast()

  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map((p) => p.category))
    return Array.from(cats).sort()
  }, [initialProducts])

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (categoryFilter !== "ALL" && product.category !== categoryFilter) return false
      if (pricingFilter !== "ALL" && product.pricingType !== pricingFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !product.name.toLowerCase().includes(q) &&
          !product.slug.toLowerCase().includes(q) &&
          !product.category.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [products, searchQuery, categoryFilter, pricingFilter])

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This will also remove all content items and access records.`)) {
      return
    }

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast({ title: "Product deleted", description: `"${name}" has been removed.` })
    } else {
      const data: { error?: string } = await res.json()
      toast({
        title: "Failed to delete",
        description: data.error || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Pricing filter */}
          <Select value={pricingFilter} onValueChange={setPricingFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Pricing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="ONE_TIME">One-Time</SelectItem>
              <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
            </SelectContent>
          </Select>

          {/* Create button */}
          <Link href="/admin/products/new">
            <Button className="w-full sm:w-auto group relative overflow-hidden">
              <span className="relative flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Product
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No products match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Stats</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{product.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{product.slug}</span>
                        <div className="flex gap-1.5 mt-0.5">
                          {product.featured && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Featured</Badge>
                          )}
                          {product.popular && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Popular</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{product.category}</TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.pricingType === "SUBSCRIPTION" ? "secondary" : "outline"}>
                        {product.pricingType === "ONE_TIME" ? "One-Time" : "Subscription"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                        <span>{product._count.contentItems} items</span>
                        <span>{product._count.purchases} sales</span>
                        <span>{product._count.productAccess} users</span>
                        {(() => {
                          const total = Array.isArray(product.deliverables) ? product.deliverables.length : 0
                          const have = product._count.contentItems
                          if (total === 0) return null
                          if (have < total) {
                            return (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-1.5 py-0.5 rounded-full border border-chart-1 text-chart-1">
                                <AlertTriangle className="h-3 w-3" />
                                {total - have} short
                              </span>
                            )
                          }
                          return (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-1.5 py-0.5 rounded-full border border-chart-2 text-chart-2">
                              <Check className="h-3 w-3" />
                              Complete
                            </span>
                          )
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(product.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/content`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
