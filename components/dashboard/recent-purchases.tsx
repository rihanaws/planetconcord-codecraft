"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRight, Receipt } from "lucide-react"
import { format } from "date-fns"

type Purchase = {
  id: string
  amount: number
  status: string
  createdAt: Date
  product: {
    id: string
    name: string
  }
}

interface RecentPurchasesProps {
  purchases: Purchase[]
}

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  if (purchases.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-12 text-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />

        <div className="relative space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Purchases Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Your purchase history will appear here once you make your first purchase.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusVariant = (status: string) => {
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
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold">Date</TableHead>
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
                  <TableCell className="font-medium text-sm">
                    {format(new Date(purchase.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {purchase.product.name}
                  </TableCell>
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
        </div>
      </div>

      {purchases.length >= 5 && (
        <div className="flex justify-center">
          <Link href="/dashboard/purchases">
            <Button variant="outline" className="group">
              <span>View All Purchases</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
