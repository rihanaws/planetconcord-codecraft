"use client"

import { ContentItemFile } from "./content-item-file"
import { ContentItemLink } from "./content-item-link"
import { ContentItemText } from "./content-item-text"
import { ContentItemVideo } from "./content-item-video"
import { FileText, Link as LinkIcon, Video, Type } from "lucide-react"

type ContentItem = {
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

interface ContentViewerProps {
  contentItems: ContentItem[]
}

export function ContentViewer({ contentItems }: ContentViewerProps) {
  if (contentItems.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-12 text-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />

        <div className="relative space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Content Available</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Content for this product is being prepared. Check back soon!
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Group content by type
  const groupedContent = contentItems.reduce((acc, item) => {
    const type = item.type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(item)
    return acc
  }, {} as Record<string, ContentItem[]>)

  const contentSections = [
    { type: "FILE", icon: FileText, label: "Files & Downloads" },
    { type: "LINK", icon: LinkIcon, label: "External Resources" },
    { type: "TEXT", icon: Type, label: "Documentation" },
    { type: "VIDEO", icon: Video, label: "Video Content" },
  ]

  return (
    <div className="space-y-8">
      {contentSections.map((section) => {
        const items = groupedContent[section.type]
        if (!items || items.length === 0) return null

        const Icon = section.icon

        return (
          <div key={section.type} className="space-y-4">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{section.label}</h3>
              <span className="text-sm text-muted-foreground">
                ({items.length})
              </span>
            </div>

            {/* Section content */}
            <div className="space-y-3">
              {items.map((item) => {
                switch (item.type) {
                  case "FILE":
                    return <ContentItemFile key={item.id} item={item} />
                  case "LINK":
                    return <ContentItemLink key={item.id} item={item} />
                  case "TEXT":
                    return <ContentItemText key={item.id} item={item} />
                  case "VIDEO":
                    return <ContentItemVideo key={item.id} item={item} />
                  default:
                    return null
                }
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
