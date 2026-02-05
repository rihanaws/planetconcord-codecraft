"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Link } from "lucide-react"

type ContentItem = {
  id: string
  title: string
  description: string | null
  linkUrl: string | null
}

interface ContentItemLinkProps {
  item: ContentItem
}

export function ContentItemLink({ item }: ContentItemLinkProps) {
  const handleOpenLink = () => {
    if (item.linkUrl) {
      window.open(item.linkUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-chart-2/10 to-transparent opacity-50" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 rounded-lg bg-chart-2/10 shrink-0">
            <Link className="h-6 w-6 text-chart-2" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-semibold text-base truncate">{item.title}</h4>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
            {item.linkUrl && (
              <p className="text-xs text-muted-foreground font-mono truncate">
                {item.linkUrl}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleOpenLink}
          disabled={!item.linkUrl}
          className="shrink-0 group/btn relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <ExternalLink className="h-4 w-4 mr-2 relative" />
          <span className="relative">Open Link</span>
        </Button>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-chart-2/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
    </div>
  )
}
