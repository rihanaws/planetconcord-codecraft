"use client"

import { useState, useMemo } from "react"
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
import { Search, Pencil, Trash2, Megaphone } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { NewsForm } from "@/components/admin/news-form"

interface NewsItemRow {
  id: string
  title: string
  body: string
  productId: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  product: { id: string; name: string } | null
}

interface NewsTableProps {
  newsItems: NewsItemRow[]
  products: { id: string; name: string }[]
}

export function NewsTable({ newsItems: initialNewsItems, products }: NewsTableProps) {
  const [newsItems, setNewsItems] = useState<NewsItemRow[]>(initialNewsItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [productFilter, setProductFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [editingItem, setEditingItem] = useState<NewsItemRow | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const filtered = useMemo(() => {
    return newsItems.filter((item) => {
      if (statusFilter === "PUBLISHED" && !item.published) return false
      if (statusFilter === "DRAFT" && item.published) return false
      if (productFilter === "GLOBAL" && item.productId !== null) return false
      if (productFilter !== "ALL" && productFilter !== "GLOBAL" && item.productId !== productFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !item.title.toLowerCase().includes(q) &&
          !item.body.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [newsItems, searchQuery, productFilter, statusFilter])

  const handleCreate = (created: NewsItemRow) => {
    setNewsItems((prev) => [created, ...prev])
    setIsCreating(false)
    toast({ title: "News item created", description: `"${created.title}" has been added.` })
  }

  const handleUpdate = (updated: NewsItemRow) => {
    setNewsItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    setEditingItem(null)
    toast({ title: "News item updated", description: `"${updated.title}" has been saved.` })
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      return
    }

    const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" })

    if (res.ok) {
      setNewsItems((prev) => prev.filter((item) => item.id !== id))
      toast({ title: "News item deleted", description: `"${title}" has been removed.` })
    } else {
      const data: { error?: string } = await res.json()
      toast({
        title: "Failed to delete",
        description: data.error || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  // If editing or creating, show the form instead of the table
  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create News Item</h2>
          <Button variant="outline" size="sm" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        </div>
        <NewsForm products={products} onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
      </div>
    )
  }

  if (editingItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit News Item</h2>
          <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
            Cancel
          </Button>
        </div>
        <NewsForm
          products={products}
          defaultValues={editingItem}
          onSubmit={handleUpdate}
          onCancel={() => setEditingItem(null)}
        />
      </div>
    )
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
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Product filter */}
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Products</SelectItem>
              <SelectItem value="GLOBAL">Global Only</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Create button */}
          <Button className="w-full sm:w-auto group relative overflow-hidden" onClick={() => setIsCreating(true)}>
            <span className="relative flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              New News
            </span>
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {newsItems.length} news items
      </p>

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          {filtered.length === 0 && newsItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No News Items</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Create your first news item to start communicating with your customers.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No news items match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Scope</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{item.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {item.body}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.product ? (
                        <Badge variant="secondary" className="text-xs">
                          {item.product.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Global
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          item.published ? "text-chart-2" : "text-muted-foreground"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.published ? "bg-chart-2" : "bg-muted-foreground"}`} />
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingItem(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.id, item.title)}
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
