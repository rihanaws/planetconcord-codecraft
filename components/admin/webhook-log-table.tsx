"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, Download, RotateCcw, Eye } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { WebhookDetailModal } from "@/components/admin/webhook-detail-modal"
import { Webhook } from "lucide-react"

interface WebhookLogRow {
  id: string
  event: string
  payload: Record<string, unknown>
  processed: boolean
  success: boolean | null
  error: string | null
  createdAt: Date
}

interface WebhookLogTableProps {
  webhooks: WebhookLogRow[]
}

export function WebhookLogTable({ webhooks: initialWebhooks }: WebhookLogTableProps) {
  const [webhooks, setWebhooks] = useState<WebhookLogRow[]>(initialWebhooks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [eventFilter, setEventFilter] = useState<string>("ALL")
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookLogRow | null>(null)
  const { toast } = useToast()

  const eventTypes = useMemo(() => {
    const events = new Set(initialWebhooks.map((w) => w.event))
    return Array.from(events).sort()
  }, [initialWebhooks])

  const filtered = useMemo(() => {
    return webhooks.filter((w) => {
      if (statusFilter === "SUCCESS" && w.success !== true) return false
      if (statusFilter === "FAILED" && w.success !== false) return false
      if (statusFilter === "PENDING" && w.processed !== false) return false
      if (eventFilter !== "ALL" && w.event !== eventFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!w.event.toLowerCase().includes(q) && !(w.error?.toLowerCase().includes(q))) {
          return false
        }
      }
      return true
    })
  }, [webhooks, searchQuery, statusFilter, eventFilter])

  const getEventBadge = (event: string): "default" | "secondary" | "destructive" | "outline" => {
    if (event.includes("succeeded")) return "default"
    if (event.includes("went_valid")) return "secondary"
    if (event.includes("went_invalid") || event.includes("refunded")) return "destructive"
    return "outline"
  }

  const handleRetry = async (id: string) => {
    const res = await fetch(`/api/admin/webhooks/${id}/retry`, { method: "POST" })
    const data: { message?: string; success?: boolean; error?: string } = await res.json()

    if (data.success) {
      toast({ title: "Retry successful", description: data.message })
      setWebhooks((prev) =>
        prev.map((w) => (w.id === id ? { ...w, processed: true, success: true, error: null } : w))
      )
    } else {
      toast({ title: "Retry failed", description: data.error || data.message || "Unknown error", variant: "destructive" })
      setWebhooks((prev) =>
        prev.map((w) => (w.id === id ? { ...w, processed: true, success: false, error: data.error || "Retry failed" } : w))
      )
    }
  }

  const exportToCSV = () => {
    const headers = ["Timestamp", "Event", "Processed", "Success", "Error"]
    const rows = filtered.map((w) => [
      format(new Date(w.createdAt), "yyyy-MM-dd HH:mm:ss"),
      w.event,
      w.processed ? "Yes" : "No",
      w.success === true ? "Yes" : w.success === false ? "No" : "N/A",
      w.error || "",
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `webhook-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (webhooks.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-12 text-center">
        <div className="absolute inset-0 bg-linear-to-br from-muted/20 to-transparent" />
        <div className="relative space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Webhook className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Webhook Events</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Webhook events from Whop will appear here once your integration is active.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Events</SelectItem>
              {eventTypes.map((event) => (
                <SelectItem key={event} value={event}>{event}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportToCSV} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {webhooks.length} webhook events
      </p>

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No events match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">Event</TableHead>
                  <TableHead className="font-semibold">Processed</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Error</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((webhook) => (
                  <TableRow
                    key={webhook.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(webhook.createdAt), "MMM d, yyyy")}
                      <br />
                      <span className="text-xs">{format(new Date(webhook.createdAt), "h:mm:ss a")}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEventBadge(webhook.event)}>
                        {webhook.event}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          webhook.processed ? "text-chart-2" : "text-muted-foreground"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${webhook.processed ? "bg-chart-2" : "bg-muted-foreground"}`} />
                        {webhook.processed ? "Yes" : "No"}
                      </span>
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
                    <TableCell className="text-xs text-destructive truncate max-w-[160px]">
                      {webhook.error || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedWebhook(webhook)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {webhook.success === false && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleRetry(webhook.id)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedWebhook && (
        <WebhookDetailModal
          webhook={selectedWebhook}
          open={!!selectedWebhook}
          onClose={() => setSelectedWebhook(null)}
          onRetry={() => handleRetry(selectedWebhook.id)}
        />
      )}
    </div>
  )
}
