"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"

interface RevokeAccessDialogProps {
  accessId: string
  userName: string
  productName: string
  open: boolean
  onClose: () => void
  onRevoked: () => void
}

export function RevokeAccessDialog({
  accessId,
  userName,
  productName,
  open,
  onClose,
  onRevoked,
}: RevokeAccessDialogProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRevoke = async () => {
    setIsLoading(true)

    const res = await fetch("/api/admin/access/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessId, reason: reason || undefined }),
    })

    if (res.ok) {
      toast({ title: "Access revoked", description: `${userName} no longer has access to ${productName}` })
      setReason("")
      onRevoked()
    } else {
      const data: { error?: string } = await res.json()
      toast({ title: "Failed", description: data.error || "Something went wrong", variant: "destructive" })
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Revoke Access</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone easily
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Confirmation info */}
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm">
              Revoking access for <span className="font-semibold">{userName}</span> to{" "}
              <span className="font-semibold">{productName}</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The user will no longer be able to access this product&apos;s content.
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <textarea
              id="reason"
              rows={2}
              placeholder="e.g. Refund requested, policy violation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isLoading}
              onClick={handleRevoke}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Revoke Access
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
