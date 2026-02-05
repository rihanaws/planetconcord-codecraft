"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, ExternalLink, Download, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface ServiceRequestDetailProps {
  item: ServiceRequestRow
  onUpdate: (updated: ServiceRequestRow) => void
  onCancel: () => void
}

export function ServiceRequestDetail({ item, onUpdate, onCancel }: ServiceRequestDetailProps) {
  const [status, setStatus] = useState(item.status)
  const [adminNotes, setAdminNotes] = useState(item.adminNotes || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(item.reportUrl)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    const res = await fetch(`/api/admin/service-requests/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes }),
    })

    if (res.ok) {
      const updated = (await res.json()) as ServiceRequestRow
      toast({ title: "Saved", description: "Service request updated." })
      onUpdate(updated)
    } else {
      const err = (await res.json()) as { error?: string }
      toast({ title: "Failed to save", description: err.error || "Something went wrong", variant: "destructive" })
    }
    setIsSaving(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`/api/admin/service-requests/${item.id}/upload`, {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      const data = (await res.json()) as { url: string; reportFileName: string }
      setUploadedUrl(data.url)
      toast({ title: "Report uploaded", description: data.reportFileName })
    } else {
      const err = (await res.json()) as { error?: string }
      toast({ title: "Upload failed", description: err.error || "Something went wrong", variant: "destructive" })
    }
    setIsUploading(false)
  }

  return (
    <div className="space-y-6">
      {/* Request Info (read-only) */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative space-y-4">
          <h3 className="text-lg font-semibold">Request Info</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Customer</p>
              <p className="text-sm mt-0.5">{item.user.name || "—"}</p>
              <p className="text-xs text-muted-foreground">{item.user.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Shopify URL</p>
              <a
                href={item.shopifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-0.5"
              >
                {item.shopifyUrl}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          {item.notes && (
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Notes</p>
              <p className="text-sm mt-0.5 whitespace-pre-wrap">{item.notes}</p>
            </div>
          )}
          {item.mustKeepApps && (
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Must-Keep Apps</p>
              <p className="text-sm mt-0.5 whitespace-pre-wrap">{item.mustKeepApps}</p>
            </div>
          )}
        </div>
      </div>

      {/* Management (editable) */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-chart-4/10 to-transparent opacity-50" />
        <div className="relative space-y-4">
          <h3 className="text-lg font-semibold">Management</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(val) => setStatus(val as ServiceRequestRow["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETE">Complete</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Notes</label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes about this request..."
              rows={3}
            />
          </div>

          {/* Report upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report</label>
            {uploadedUrl ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-chart-2">
                  <Check className="h-4 w-4" />
                  Report uploaded
                </span>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleUpload}
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={(e) => {
                      e.preventDefault()
                      const input = (e.currentTarget.parentElement as HTMLLabelElement).querySelector("input")
                      input?.click()
                    }}
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      "Upload Report"
                    )}
                  </Button>
                </label>
                <span className="text-xs text-muted-foreground">PDF, max 50MB</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={isSaving} className="group relative overflow-hidden">
              <span className="relative flex items-center gap-2">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save"}
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
