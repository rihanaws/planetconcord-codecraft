"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2 } from "lucide-react"

interface ProductRow {
  id: string
  name: string
  slug: string
  whopProductId: string | null
  whopCheckoutUrl: string | null
}

interface ProductWhopMappingProps {
  products: ProductRow[]
}

export function ProductWhopMapping({ products: initialProducts }: ProductWhopMappingProps) {
  const [products, setProducts] = useState(initialProducts)
  const [edits, setEdits] = useState<Record<string, { whopProductId?: string; whopCheckoutUrl?: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()

  const getEditValue = (productId: string, field: "whopProductId" | "whopCheckoutUrl") => {
    if (edits[productId]?.[field] !== undefined) return edits[productId][field] || ""
    const product = products.find((p) => p.id === productId)
    return product?.[field] || ""
  }

  const handleChange = (productId: string, field: "whopProductId" | "whopCheckoutUrl", value: string) => {
    setEdits((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }))
  }

  const handleSave = async (productId: string) => {
    const edit = edits[productId]
    if (!edit) return

    setSaving(productId)
    try {
      const res = await fetch(`/api/admin/products/${productId}/whop`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whopProductId: getEditValue(productId, "whopProductId") || null,
          whopCheckoutUrl: getEditValue(productId, "whopCheckoutUrl") || null,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      const updated = await res.json()
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updated } : p)))
      setEdits((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })

      toast({ title: "Saved", description: "Product Whop mapping updated." })
    } catch {
      toast({ title: "Error", description: "Failed to save Whop mapping.", variant: "destructive" })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

      <div className="relative p-6 pb-0">
        <h2 className="text-lg font-semibold">Per-Product Whop Mapping</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Map each product to its Whop product ID and checkout URL for webhook processing.
        </p>
      </div>

      <div className="relative overflow-x-auto mt-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Whop Product ID</TableHead>
              <TableHead className="font-semibold">Whop Checkout URL</TableHead>
              <TableHead className="font-semibold w-20">Status</TableHead>
              <TableHead className="font-semibold w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-border/50">
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{product.slug}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    className="h-8 text-xs font-mono"
                    placeholder="prod_xxx..."
                    value={getEditValue(product.id, "whopProductId")}
                    onChange={(e) => handleChange(product.id, "whopProductId", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    className="h-8 text-xs font-mono"
                    placeholder="https://whop.com/checkout/..."
                    value={getEditValue(product.id, "whopCheckoutUrl")}
                    onChange={(e) => handleChange(product.id, "whopCheckoutUrl", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  {product.whopProductId ? (
                    <Badge variant="default" className="text-[10px]">Linked</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">Unlinked</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {edits[product.id] && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={saving === product.id}
                      onClick={() => handleSave(product.id)}
                    >
                      {saving === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
