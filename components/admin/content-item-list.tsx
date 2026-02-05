"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContentItemForm } from "@/components/admin/content-item-form"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, FileText, Link2, Type, Video, GripVertical } from "lucide-react"

interface ContentItemRow {
  id: string
  type: string
  title: string
  description: string | null
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
  linkUrl: string | null
  textContent: string | null
  videoUrl: string | null
  order: number
}

interface ContentItemListProps {
  productId: string
  initialItems: ContentItemRow[]
}

export function ContentItemList({ productId, initialItems }: ContentItemListProps) {
  const [items, setItems] = useState<ContentItemRow[]>(initialItems)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "FILE":
        return <FileText className="h-4 w-4 text-chart-1" />
      case "LINK":
        return <Link2 className="h-4 w-4 text-chart-2" />
      case "TEXT":
        return <Type className="h-4 w-4 text-chart-3" />
      case "VIDEO":
        return <Video className="h-4 w-4 text-chart-4" />
      default:
        return null
    }
  }

  const getTypeBadge = (type: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (type) {
      case "FILE":
        return "default"
      case "LINK":
        return "secondary"
      case "TEXT":
        return "outline"
      case "VIDEO":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "FILE":
        return "File"
      case "LINK":
        return "Link"
      case "TEXT":
        return "Text"
      case "VIDEO":
        return "Video"
      default:
        return type
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return

    const res = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast({ title: "Content deleted", description: `"${title}" has been removed.` })
    } else {
      const data: { error?: string } = await res.json()
      toast({ title: "Failed", description: data.error || "Something went wrong", variant: "destructive" })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    // Refresh the page to get updated items from server
    window.location.reload()
  }

  if (items.length === 0 && !showForm) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-12 text-center">
          <div className="absolute inset-0 bg-linear-to-br from-muted/20 to-transparent" />
          <div className="relative space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Content Items Yet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Add files, links, text, or videos that customers will access after purchase.
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="mt-2 group relative overflow-hidden">
              <span className="relative flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Content
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Content Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

            <div className="relative flex items-center gap-4 p-4">
              {/* Drag handle (visual only) */}
              <div className="text-muted-foreground/40">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Type icon */}
              <div className="p-2 rounded-lg bg-accent/50">
                {getTypeIcon(item.type)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.title}</span>
                  <Badge variant={getTypeBadge(item.type)} className="text-[10px] px-1.5 py-0">
                    {getTypeLabel(item.type)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">#{item.order}</span>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                )}
                {/* Type-specific preview */}
                {item.type === "FILE" && item.fileName && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.fileName} {item.fileSize ? `· ${(item.fileSize / 1024).toFixed(1)} KB` : ""}</p>
                )}
                {item.type === "LINK" && item.linkUrl && (
                  <p className="text-xs text-chart-2 mt-0.5 truncate">{item.linkUrl}</p>
                )}
                {item.type === "VIDEO" && item.videoUrl && (
                  <p className="text-xs text-chart-4 mt-0.5 truncate">{item.videoUrl}</p>
                )}
              </div>

              {/* Delete */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => handleDelete(item.id, item.title)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Content Form or Button */}
      {showForm ? (
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
          <div className="absolute inset-0 bg-linear-to-br from-chart-1/10 to-transparent opacity-50" />
          <div className="relative">
            <h3 className="text-lg font-semibold mb-4">Add New Content Item</h3>
            <ContentItemForm
              productId={productId}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Content Item
        </Button>
      )}
    </div>
  )
}
