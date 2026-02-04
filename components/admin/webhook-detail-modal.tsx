"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { RotateCcw } from "lucide-react"

interface WebhookLogRow {
  id: string
  event: string
  payload: Record<string, unknown>
  processed: boolean
  success: boolean | null
  error: string | null
  createdAt: Date
}

interface WebhookDetailModalProps {
  webhook: WebhookLogRow
  open: boolean
  onClose: () => void
  onRetry: () => void
}

export function WebhookDetailModal({ webhook, open, onClose, onRetry }: WebhookDetailModalProps) {
  const getEventBadge = (event: string): "default" | "secondary" | "destructive" | "outline" => {
    if (event.includes("succeeded")) return "default"
    if (event.includes("went_valid")) return "secondary"
    if (event.includes("went_invalid") || event.includes("refunded")) return "destructive"
    return "outline"
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Badge variant={getEventBadge(webhook.event)}>{webhook.event}</Badge>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                webhook.success === true ? "text-chart-2" : webhook.success === false ? "text-destructive" : "text-muted-foreground"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  webhook.success === true ? "bg-chart-2" : webhook.success === false ? "bg-destructive" : "bg-muted-foreground"
                }`} />
                {webhook.success === true ? "Success" : webhook.success === false ? "Failed" : "Pending"}
              </span>
            </DialogTitle>
            {webhook.success === false && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Retry
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(webhook.createdAt), "MMM d, yyyy h:mm:ss a")} · ID: <span className="font-mono text-xs">{webhook.id}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-accent/30 border border-border/30">
              <p className="text-xs text-muted-foreground">Processed</p>
              <p className="text-sm font-medium">{webhook.processed ? "Yes" : "No"}</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/30 border border-border/30">
              <p className="text-xs text-muted-foreground">Result</p>
              <p className={`text-sm font-medium ${
                webhook.success === true ? "text-chart-2" : webhook.success === false ? "text-destructive" : "text-muted-foreground"
              }`}>
                {webhook.success === true ? "Success" : webhook.success === false ? "Failed" : "N/A"}
              </p>
            </div>
          </div>

          {/* Error (if any) */}
          {webhook.error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs font-semibold text-destructive mb-1">Error</p>
              <p className="text-xs text-destructive font-mono whitespace-pre-wrap">{webhook.error}</p>
            </div>
          )}

          {/* Payload JSON Viewer */}
          <div>
            <p className="text-sm font-semibold mb-2">Payload</p>
            <div className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/30">
              <pre className="p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-foreground">
                {JSON.stringify(webhook.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
