"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ShieldCheck } from "lucide-react"

interface UserOption {
  id: string
  name: string | null
  email: string
}

interface ProductOption {
  id: string
  name: string
}

interface GrantAccessDialogProps {
  users: UserOption[]
  products: ProductOption[]
  open: boolean
  onClose: () => void
  onGranted: () => void
}

export function GrantAccessDialog({
  users,
  products,
  open,
  onClose,
  onGranted,
}: GrantAccessDialogProps) {
  const [userId, setUserId] = useState("")
  const [productId, setProductId] = useState("")
  const [accessType, setAccessType] = useState<"LIFETIME" | "SUBSCRIPTION">("LIFETIME")
  const [expiresAt, setExpiresAt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!userId || !productId) {
      toast({ title: "Missing fields", description: "Select both a user and a product", variant: "destructive" })
      return
    }

    setIsLoading(true)

    const payload: {
      userId: string
      productId: string
      accessType: string
      expiresAt?: string
    } = { userId, productId, accessType }

    if (accessType === "SUBSCRIPTION" && expiresAt) {
      payload.expiresAt = expiresAt
    }

    const res = await fetch("/api/admin/access/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      toast({ title: "Access granted", description: "User now has access to the product" })
      setUserId("")
      setProductId("")
      setAccessType("LIFETIME")
      setExpiresAt("")
      onGranted()
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
            <div className="p-2 rounded-lg bg-chart-2/10">
              <ShieldCheck className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Grant Product Access</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Manually grant a user access to a product
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* User */}
          <div className="space-y-2">
            <Label>Select User</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product */}
          <div className="space-y-2">
            <Label>Select Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Access Type */}
          <div className="space-y-2">
            <Label>Access Type</Label>
            <Select value={accessType} onValueChange={(val) => setAccessType(val as "LIFETIME" | "SUBSCRIPTION")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LIFETIME">Lifetime</SelectItem>
                <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expiration (subscription only) */}
          {accessType === "SUBSCRIPTION" && (
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiration Date</Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" disabled={isLoading} onClick={handleSubmit} className="group relative overflow-hidden">
              <span className="relative flex items-center gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Grant Access
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
