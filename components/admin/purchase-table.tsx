"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { PurchaseFilters } from "@/components/admin/purchase-filters"
import { Receipt } from "lucide-react"

interface PurchaseRow {
  id: string
  amount: number
  status: string
  whopPaymentId: string | null
  createdAt: Date
  completedAt: Date | null
  refundedAt: Date | null
  user: { id: string; name: string | null; email: string }
  product: { id: string; name: string; slug: string }
}

interface ProductOption {
  id: string
  name: string
}

interface PurchaseTableProps {
  purchases: PurchaseRow[]
  products: ProductOption[]
}

export function PurchaseTable({ purchases: initialPurchases, products }: PurchaseTableProps) {
  const [purchases] = useState<PurchaseRow[]>(initialPurchases)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [productFilter, setProductFilter] = useState<string>("ALL")
  const { toast } = useToast()

  const filtered = useMemo(() => {
    return purchases.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false
      if (productFilter !== "ALL" && p.product.id !== productFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !p.user.email.toLowerCase().includes(q) &&
          !(p.user.name?.toLowerCase().includes(q)) &&
          !p.product.name.toLowerCase().includes(q) &&
          !(p.whopPaymentId?.toLowerCase().includes(q))
        ) {
          return false
        }
      }
      return true
    })
  }, [purchases, searchQuery, statusFilter, productFilter])

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REFUNDED":
      case "FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // For now, just show a toast — manual DB status change would need a dedicated API
    toast({ title: "Status update", description: `Would update purchase ${id} to ${newStatus}. (Manual update via Whop dashboard recommended.)` })
  }

  const exportToCSV = () => {
    const headers = ["Date", "Customer", "Email", "Product", "Amount", "Status", "Whop Payment ID"]
    const rows = filtered.map((p) => [
      format(new Date(p.createdAt), "yyyy-MM-dd HH:mm:ss"),
      p.user.name || "Anonymous",
      p.user.email,
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
        <div className="absolute inset-0 bg-linear-to-br from-muted/20 to-transparent" />
        <div className="relative space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Purchases Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Purchase records will appear here once customers complete transactions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PurchaseFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        productFilter={productFilter}
        onProductChange={setProductFilter}
        products={products}
        onExport={exportToCSV}
        resultCount={filtered.length}
        totalCount={purchases.length}
      />

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No purchases match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Whop ID</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((purchase) => (
                  <TableRow
                    key={purchase.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell className="text-sm">
                      {format(new Date(purchase.createdAt), "MMM d, yyyy")}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(purchase.createdAt), "h:mm a")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{purchase.user.name || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">{purchase.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{purchase.product.name}</TableCell>
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs"
                        onClick={() => handleStatusUpdate(purchase.id, purchase.status === "PENDING" ? "COMPLETED" : "PENDING")}
                      >
                        Update
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
