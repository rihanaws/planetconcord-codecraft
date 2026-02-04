"use client"

import { useState } from "react"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

type ContentItem = {
  id: string
  title: string
  description: string | null
  textContent: string | null
}

interface ContentItemTextProps {
  item: ContentItem
}

export function ContentItemText({ item }: ContentItemTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent opacity-50" />

      <div className="relative">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-start justify-between gap-4 p-6 text-left transition-colors duration-200 hover:bg-accent/20"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="p-3 rounded-lg bg-chart-3/10 shrink-0">
              <FileText className="h-6 w-6 text-chart-3" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="font-semibold text-base">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-6 pt-0 border-t border-border/30">
            {item.textContent ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {item.textContent}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No content available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-chart-3/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
    </div>
  )
}
