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
import { Receipt, Search, Download, ExternalLink } from "lucide-react"
import { format } from "date-fns"

type Purchase = {
  id: string
  whopPaymentId: string | null
  amount: number
  status: string
  createdAt: Date
  product: {
    id: string
    name: string
    slug: string
  }
}

interface PurchaseHistoryTableProps {
  purchases: Purchase[]
}

export function PurchaseHistoryTable({ purchases }: PurchaseHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  // Filter and search purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      // Status filter
      if (statusFilter !== "ALL" && purchase.status !== statusFilter) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesProduct = purchase.product.name.toLowerCase().includes(query)
        const matchesId = purchase.id.toLowerCase().includes(query)
        const matchesWhopId = purchase.whopPaymentId?.toLowerCase().includes(query)
        return matchesProduct || matchesId || matchesWhopId
      }

      return true
    })
  }, [purchases, searchQuery, statusFilter])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REFUNDED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const exportToCSV = () => {
    const headers = ["Date", "Product", "Amount", "Status", "Payment ID"]
    const rows = filteredPurchases.map((p) => [
      format(new Date(p.createdAt), "yyyy-MM-dd HH:mm:ss"),
      p.product.name,
      p.amount.toFixed(2),
      p.status,
      p.whopPaymentId || "N/A",
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `purchases-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (purchases.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-12 text-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-muted/20 to-transparent" />

        <div className="relative space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Purchases Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Your purchase history will appear here once you make your first purchase.
            </p>
          </div>
          <Link href="/products">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Export button */}
          <Button
            onClick={exportToCSV}
            variant="outline"
            disabled={filteredPurchases.length === 0}
            className="group"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPurchases.length} of {purchases.length} purchases
        </p>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          {filteredPurchases.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No purchases match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment ID</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow
                    key={purchase.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-sm">
                      {format(new Date(purchase.createdAt), "MMM d, yyyy")}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(purchase.createdAt), "h:mm a")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">
                          {purchase.product.name}
                        </span>
                        <Link
                          href={`/dashboard/products/${purchase.product.slug}`}
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View product
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      ${purchase.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(purchase.status)}>
                        {purchase.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {purchase.whopPaymentId || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="h-8 text-xs">
                        Receipt
                      </Button>
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
