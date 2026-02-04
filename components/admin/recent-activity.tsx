"use client"

import Link from "next/link"
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
import { Receipt, Webhook, ArrowRight } from "lucide-react"
import { format } from "date-fns"

// --- Recent Purchases Table ---

interface RecentPurchaseRow {
  id: string
  amount: number
  status: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  product: {
    name: string
  }
}

interface RecentPurchasesProps {
  purchases: RecentPurchaseRow[]
}

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <Receipt className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Recent Purchases</h3>
              <p className="text-sm text-muted-foreground">Last 10 transactions</p>
            </div>
          </div>
          <Link href="/admin/purchases">
            <Button variant="ghost" size="sm" className="text-xs">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {purchases.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No recent purchases</p>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow
                    key={purchase.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(purchase.createdAt), "MMM d, yyyy")}
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

// --- Recent Webhook Events Table ---

interface RecentWebhookRow {
  id: string
  event: string
  processed: boolean
  success: boolean | null
  error: string | null
  createdAt: Date
}

interface RecentWebhooksProps {
  webhooks: RecentWebhookRow[]
}

export function RecentWebhooks({ webhooks }: RecentWebhooksProps) {
  const getEventBadge = (event: string): "default" | "secondary" | "destructive" | "outline" => {
    if (event.includes("succeeded")) return "default"
    if (event.includes("valid") && !event.includes("invalid")) return "secondary"
    if (event.includes("invalid") || event.includes("refunded")) return "destructive"
    return "outline"
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Webhook className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Recent Webhook Events</h3>
              <p className="text-sm text-muted-foreground">Last 10 events</p>
            </div>
          </div>
          <Link href="/admin/webhooks">
            <Button variant="ghost" size="sm" className="text-xs">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {webhooks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No recent webhook events</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">Event</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow
                    key={webhook.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(webhook.createdAt), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEventBadge(webhook.event)}>
                        {webhook.event}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          webhook.success === true
                            ? "text-chart-2"
                            : webhook.success === false
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            webhook.success === true
                              ? "bg-chart-2"
                              : webhook.success === false
                              ? "bg-destructive"
                              : "bg-muted-foreground"
                          }`}
                        />
                        {webhook.success === true ? "Success" : webhook.success === false ? "Failed" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-destructive truncate max-w-[200px]">
                      {webhook.error || "—"}
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
