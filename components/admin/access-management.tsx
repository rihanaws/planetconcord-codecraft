"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ShieldCheck, Slash } from "lucide-react"
import { format } from "date-fns"
import { GrantAccessDialog } from "@/components/admin/grant-access-dialog"

interface UserOption {
  id: string
  name: string | null
  email: string
}

interface ProductOption {
  id: string
  name: string
}

interface AccessRecord {
  id: string
  status: string
  user: { name: string | null; email: string }
  product: { name: string }
  grantedAt: Date
}

interface AccessManagementProps {
  users: UserOption[]
  products: ProductOption[]
  accessRecords: AccessRecord[]
}

export function AccessManagement({ users, products, accessRecords }: AccessManagementProps) {
  const [showGrantDialog, setShowGrantDialog] = useState(false)

  const exportToCSV = () => {
    const headers = ["User", "Email", "Product", "Status", "Granted"]
    const rows = accessRecords.map((r) => [
      r.user.name || "Anonymous",
      r.user.email,
      r.product.name,
      r.status,
      format(new Date(r.grantedAt), "yyyy-MM-dd"),
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `access-list-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const activeCount = accessRecords.filter((r) => r.status === "ACTIVE").length
  const revokedCount = accessRecords.filter((r) => r.status === "REVOKED" || r.status === "EXPIRED").length

  return (
    <div className="space-y-6">
      {/* Summary + Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Active count */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-linear-to-br from-chart-2/20 to-transparent opacity-50" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Active Access</p>
              <p className="text-3xl font-semibold tracking-tight">{activeCount}</p>
            </div>
            <div className="bg-chart-2/10 p-3 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-chart-2" />
            </div>
          </div>
        </div>

        {/* Revoked count */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-linear-to-br from-chart-5/20 to-transparent opacity-50" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Revoked / Expired</p>
              <p className="text-3xl font-semibold tracking-tight">{revokedCount}</p>
            </div>
            <div className="bg-chart-5/10 p-3 rounded-xl">
              <Slash className="h-6 w-6 text-chart-5" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 flex flex-col items-center justify-center gap-3">
          <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
          <div className="relative flex flex-col gap-2 w-full">
            <Button
              onClick={() => setShowGrantDialog(true)}
              className="w-full group relative overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Grant Access
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Grant Dialog */}
      <GrantAccessDialog
        users={users}
        products={products}
        open={showGrantDialog}
        onClose={() => setShowGrantDialog(false)}
        onGranted={() => {
          setShowGrantDialog(false)
          window.location.reload()
        }}
      />
    </div>
  )
}
