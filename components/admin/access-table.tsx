"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Search, Slash, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { RevokeAccessDialog } from "@/components/admin/revoke-access-dialog"

interface AccessRow {
  id: string
  status: string
  accessType: string
  deliveryStatus: string | null
  deliveredAt: Date | null
  backlogNotes: string | null
  expiresAt: Date | null
  revokedAt: Date | null
  revokedReason: string | null
  grantedAt: Date
  user: { id: string; name: string | null; email: string }
  product: { id: string; name: string; slug: string }
}

interface AccessTableProps {
  accessRecords: AccessRow[]
}

export function AccessTable({ accessRecords: initialRecords }: AccessTableProps) {
  const [records, setRecords] = useState<AccessRow[]>(initialRecords)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [revokeTarget, setRevokeTarget] = useState<AccessRow | null>(null)
  const [loadingDelivery, setLoadingDelivery] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return records.filter((record) => {
      if (statusFilter !== "ALL" && record.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !record.user.email.toLowerCase().includes(q) &&
          !(record.user.name?.toLowerCase().includes(q)) &&
          !record.product.name.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [records, searchQuery, statusFilter])

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "PENDING":
        return "secondary"
      case "REVOKED":
      case "EXPIRED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleRevoked = (accessId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === accessId ? { ...r, status: "REVOKED", revokedAt: new Date() } : r
      )
    )
    setRevokeTarget(null)
  }

  const handleDeliveryUpdate = async (accessId: string, deliveryStatus: "DELIVERED" | "BACKLOGGED") => {
    setLoadingDelivery(accessId)
    try {
      const res = await fetch("/api/admin/access/delivery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessId, deliveryStatus }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setRecords((prev) =>
        prev.map((r) =>
          r.id === accessId
            ? { ...r, deliveryStatus, deliveredAt: deliveryStatus === "DELIVERED" ? new Date() : r.deliveredAt }
            : r
        )
      )
    } catch {
      // silent fail — user will see no change
    } finally {
      setLoadingDelivery(null)
    }
  }

  const getDeliveryBadge = (record: AccessRow) => {
    if (record.status === "REVOKED" || record.status === "EXPIRED") return null
    const status = record.deliveryStatus || "PENDING"
    switch (status) {
      case "DELIVERED":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </Badge>
        )
      case "BACKLOGGED":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Backlogged
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="REVOKED">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {records.length} access records
        </p>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No access records match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Delivery</TableHead>
                  <TableHead className="font-semibold">Granted</TableHead>
                  <TableHead className="font-semibold">Expires</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{record.user.name || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">{record.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{record.product.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{record.product.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{record.accessType.toLowerCase()}</TableCell>
                    <TableCell>
                      {getDeliveryBadge(record)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(record.grantedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {record.expiresAt ? format(new Date(record.expiresAt), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {record.status === "ACTIVE" && record.deliveryStatus !== "DELIVERED" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs"
                          disabled={loadingDelivery === record.id}
                          onClick={() => handleDeliveryUpdate(record.id, "DELIVERED")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Deliver
                        </Button>
                      )}
                      {record.status === "ACTIVE" && record.deliveryStatus !== "BACKLOGGED" && record.deliveryStatus !== "DELIVERED" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-amber-600 hover:text-amber-600 hover:bg-amber-600/10"
                          disabled={loadingDelivery === record.id}
                          onClick={() => handleDeliveryUpdate(record.id, "BACKLOGGED")}
                        >
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                          Backlog
                        </Button>
                      )}
                      {record.status === "ACTIVE" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setRevokeTarget(record)}
                        >
                          <Slash className="h-3.5 w-3.5 mr-1" />
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Revoke Dialog */}
      {revokeTarget && (
        <RevokeAccessDialog
          accessId={revokeTarget.id}
          userName={revokeTarget.user.name || revokeTarget.user.email}
          productName={revokeTarget.product.name}
          open={!!revokeTarget}
          onClose={() => setRevokeTarget(null)}
          onRevoked={() => handleRevoked(revokeTarget.id)}
        />
      )}
    </div>
  )
}
