"use client"

import { Button } from "@/components/ui/button"
import { Download, File } from "lucide-react"

type ContentItem = {
  id: string
  title: string
  description: string | null
  fileUrl: string | null
  fileSize: number | null
}

interface ContentItemFileProps {
  item: ContentItem
}

export function ContentItemFile({ item }: ContentItemFileProps) {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleDownload = () => {
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank")
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 rounded-lg bg-primary/10 shrink-0">
            <File className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-semibold text-base truncate">{item.title}</h4>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground font-mono">
              {formatFileSize(item.fileSize)}
            </p>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={!item.fileUrl}
          className="shrink-0 group/btn relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <Download className="h-4 w-4 mr-2 relative" />
          <span className="relative">Download</span>
        </Button>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
    </div>
  )
}
