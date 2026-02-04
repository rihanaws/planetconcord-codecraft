"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface UserDetail {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  purchases: {
    id: string
    amount: number
    status: string
    createdAt: Date
    product: { name: string }
  }[]
  productAccess: {
    id: string
    status: string
    accessType: string
    expiresAt: Date | null
    grantedAt: Date
    product: { name: string; slug: string }
  }[]
  accounts: { provider: string; providerAccountId: string }[]
}

interface UserDetailModalProps {
  userId: string
  userName: string
  userEmail: string
  userRole: string
  open: boolean
  onClose: () => void
}

export function UserDetailModal({
  userId,
  userName,
  userEmail,
  userRole,
  open,
  onClose,
}: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState(userRole)
  const { toast } = useToast()

  useEffect(() => {
    if (!open) return

    const fetchUser = async () => {
      setIsLoading(true)
      const res = await fetch(`/api/admin/users/${userId}`)
      if (res.ok) {
        const data: UserDetail = await res.json()
        setUser(data)
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [open, userId])

  const handleRoleChange = async (newRole: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })

    if (res.ok) {
      setRole(newRole)
      toast({ title: "Role updated", description: `${userName}'s role changed to ${newRole}` })
    } else {
      const data: { error?: string } = await res.json()
      toast({ title: "Failed", description: data.error || "Something went wrong", variant: "destructive" })
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "COMPLETED":
      case "ACTIVE":
        return "default"
      case "PENDING":
        return "secondary"
      case "REFUNDED":
      case "REVOKED":
      case "EXPIRED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{userName}</DialogTitle>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Role & Info */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/30">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Role</span>
                <span className="text-xs text-muted-foreground">
                  Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Connected Accounts */}
            {user.accounts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Connected Accounts</h4>
                <div className="flex gap-2">
                  {user.accounts.map((acc) => (
                    <Badge key={acc.provider} variant="outline" className="capitalize">
                      {acc.provider}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Product Access */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Product Access ({user.productAccess.length})</h4>
              {user.productAccess.length === 0 ? (
                <p className="text-xs text-muted-foreground">No product access records</p>
              ) : (
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border/50">
                        <TableHead className="font-semibold text-xs">Product</TableHead>
                        <TableHead className="font-semibold text-xs">Status</TableHead>
                        <TableHead className="font-semibold text-xs">Type</TableHead>
                        <TableHead className="font-semibold text-xs">Granted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.productAccess.map((access) => (
                        <TableRow key={access.id} className="border-border/50">
                          <TableCell className="text-xs font-medium">{access.product.name}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(access.status)} className="text-[10px]">
                              {access.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs capitalize">{access.accessType.toLowerCase()}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(access.grantedAt), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Purchases */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Purchases ({user.purchases.length})</h4>
              {user.purchases.length === 0 ? (
                <p className="text-xs text-muted-foreground">No purchases</p>
              ) : (
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border/50">
                        <TableHead className="font-semibold text-xs">Product</TableHead>
                        <TableHead className="font-semibold text-xs">Amount</TableHead>
                        <TableHead className="font-semibold text-xs">Status</TableHead>
                        <TableHead className="font-semibold text-xs">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.purchases.map((purchase) => (
                        <TableRow key={purchase.id} className="border-border/50">
                          <TableCell className="text-xs font-medium">{purchase.product.name}</TableCell>
                          <TableCell className="text-xs font-mono">${purchase.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(purchase.status)} className="text-[10px]">
                              {purchase.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(purchase.createdAt), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Failed to load user details</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
