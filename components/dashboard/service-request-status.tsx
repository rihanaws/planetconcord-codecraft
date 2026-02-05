"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, ClipboardList } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ServiceRequestForm } from "@/components/dashboard/service-request-form"

interface ServiceRequestRow {
  id: string
  shopifyUrl: string
  notes: string | null
  mustKeepApps: string | null
  status: "PENDING" | "IN_PROGRESS" | "COMPLETE" | "CANCELLED"
  reportUrl: string | null
  reportFileName: string | null
  createdAt: string
  product: { name: string } | null
}

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  PENDING: { dot: "bg-muted-foreground", label: "Pending" },
  IN_PROGRESS: { dot: "bg-chart-1", label: "In Progress" },
  COMPLETE: { dot: "bg-chart-2", label: "Complete" },
  CANCELLED: { dot: "bg-destructive", label: "Cancelled" },
}

export function ServiceRequestStatus() {
  const [requests, setRequests] = useState<ServiceRequestRow[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/dashboard/service-request")
      .then((r) => r.json())
      .then((data: ServiceRequestRow[]) => {
        setRequests(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const handleSubmit = (created: ServiceRequestRow) => {
    setRequests((prev) => [created, ...prev])
    setShowForm(false)
  }

  if (showForm) {
    return <ServiceRequestForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
  }

  return (
    <div className="space-y-4">
      {/* Submit button */}
      <Button
        onClick={() => setShowForm(true)}
        className="w-full group relative overflow-hidden"
      >
        <span className="relative flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Submit Your Store
        </span>
        <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </Button>

      {/* Past requests */}
      {loaded && requests.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 text-center">
          <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
          <div className="relative">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No requests yet. Submit your first store above.
            </p>
          </div>
        </div>
      )}

      {requests.map((req) => {
        const style = STATUS_STYLES[req.status]
        return (
          <div
            key={req.id}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-4"
          >
            <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
            <div className="relative space-y-3">
              {/* Header row */}
              <div className="flex items-center justify-between gap-4">
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                  {style.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                </span>
              </div>

              {/* Shopify URL */}
              <a
                href={req.shopifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                {req.shopifyUrl}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {/* Download report */}
              {req.status === "COMPLETE" && req.reportUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    window.location.href = req.reportUrl!
                  }}
                >
                  Download Report
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
