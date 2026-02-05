"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Megaphone } from "lucide-react"

interface NewsItemData {
  id: string
  title: string
  body: string
  createdAt: Date
  product: { name: string } | null
}

interface NewsFeedProps {
  newsItems: NewsItemData[]
}

export function NewsFeed({ newsItems }: NewsFeedProps) {
  if (newsItems.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 text-center">
        <div className="absolute inset-0 bg-linear-to-br from-muted/20 to-transparent" />
        <div className="relative space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No news yet. Check back soon!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {newsItems.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative space-y-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Megaphone className="h-3.5 w-3.5 text-primary" />
                </div>
                <h4 className="font-semibold text-base">{item.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                {item.product && (
                  <Badge variant="secondary" className="text-xs">
                    {item.product.name}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {item.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
