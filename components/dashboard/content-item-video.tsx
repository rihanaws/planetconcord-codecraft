"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Video } from "lucide-react"

type ContentItem = {
  id: string
  title: string
  description: string | null
  videoUrl: string | null
}

interface ContentItemVideoProps {
  item: ContentItem
}

export function ContentItemVideo({ item }: ContentItemVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Extract video ID and provider from URL
  const getVideoEmbed = (url: string | null) => {
    if (!url) return null

    // YouTube
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return {
        provider: "youtube",
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`,
        thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`,
      }
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return {
        provider: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        thumbnail: null,
      }
    }

    return null
  }

  const videoEmbed = getVideoEmbed(item.videoUrl)

  if (!videoEmbed) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-destructive/10">
            <Video className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h4 className="font-semibold text-base">{item.title}</h4>
            <p className="text-sm text-destructive">Invalid video URL</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-chart-4/10 to-transparent opacity-50" />

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-chart-4/10 shrink-0">
            <Video className="h-6 w-6 text-chart-4" />
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

        {/* Video player */}
        {isPlaying ? (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={videoEmbed.embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            className="relative w-full aspect-video rounded-lg overflow-hidden bg-black group/play"
          >
            {videoEmbed.thumbnail && (
              <Image
                src={videoEmbed.thumbnail}
                alt={item.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover/play:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover/play:bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 rounded-full bg-primary/90 backdrop-blur-sm transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-primary">
                <Play className="h-8 w-8 text-primary-foreground fill-current" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-chart-4/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
    </div>
  )
}
