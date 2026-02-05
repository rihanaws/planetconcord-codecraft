"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { Search, Pencil, ExternalLink, ClipboardList } from "lucide-react"
import { format } from "date-fns"
import { ServiceRequestDetail } from "@/components/admin/service-request-detail"

interface ServiceRequestRow {
  id: string
  userId: string
  productId: string
  shopifyUrl: string
  notes: string | null
  mustKeepApps: string | null
  status: "PENDING" | "IN_PROGRESS" | "COMPLETE" | "CANCELLED"
  reportUrl: string | null
  reportFileName: string | null
  adminNotes: string | null
  createdAt: string
  updatedAt: string
  user: { id: string; name: string | null; email: string }
  product: { id: string; name: string }
}

interface ProductOption {
  id: string
  name: string
}

interface ServiceRequestTableProps {
  serviceRequests: ServiceRequestRow[]
  products: ProductOption[]
}

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  PENDING: { dot: "bg-muted-foreground", label: "Pending" },
  IN_PROGRESS: { dot: "bg-chart-1", label: "In Progress" },
  COMPLETE: { dot: "bg-chart-2", label: "Complete" },
  CANCELLED: { dot: "bg-destructive", label: "Cancelled" },
}

export function ServiceRequestTable({ serviceRequests: initial, products }: ServiceRequestTableProps) {
  const [requests, setRequests] = useState<ServiceRequestRow[]>(initial)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [productFilter, setProductFilter] = useState<string>("ALL")
  const [editingItem, setEditingItem] = useState<ServiceRequestRow | null>(null)

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== "ALL" && req.status !== statusFilter) return false
      if (productFilter !== "ALL" && req.productId !== productFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !req.shopifyUrl.toLowerCase().includes(q) &&
          !req.user.email.toLowerCase().includes(q) &&
          !(req.user.name || "").toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [requests, searchQuery, statusFilter, productFilter])

  const handleUpdate = (updated: ServiceRequestRow) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    setEditingItem(null)
  }

  if (editingItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Service Request</h2>
          <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
            Cancel
          </Button>
        </div>
        <ServiceRequestDetail
          item={editingItem}
          onUpdate={handleUpdate}
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
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by URL or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETE">Complete</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {requests.length} service requests
      </p>

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative overflow-x-auto">
          {filtered.length === 0 && requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No Service Requests</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Customer service requests will appear here once submitted.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No service requests match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Shopify URL</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((req) => {
                  const style = STATUS_STYLES[req.status]
                  return (
                    <TableRow
                      key={req.id}
                      className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                    >
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm">{req.user.name || "—"}</span>
                          <span className="text-xs text-muted-foreground">{req.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{req.product.name}</TableCell>
                      <TableCell>
                        <a
                          href={req.shopifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline truncate max-w-[200px]"
                        >
                          <span className="truncate">{req.shopifyUrl}</span>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                          {style.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(req.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingItem(req)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
