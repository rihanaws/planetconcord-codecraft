"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

const analyzeSchema = z.object({
  videoUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => /youtube\.com|youtu\.be|vimeo\.com/.test(url),
      { message: "Must be a YouTube or Vimeo URL" }
    ),
  notes: z.string().optional(),
})

type AnalyzeInput = z.infer<typeof analyzeSchema>

interface Recommendation {
  category: string
  tip: string
}

interface VideoAnalysisRow {
  id: string
  videoUrl: string
  notes: string | null
  qualityScore: number | null
  engagementScore: number | null
  recommendations: Recommendation[] | null
  status: "PENDING" | "COMPLETE" | "FAILED"
  createdAt: string
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80 ? "text-chart-2" : score >= 60 ? "text-chart-1" : "text-destructive"
  const bgColor =
    score >= 80 ? "bg-chart-2/10" : score >= 60 ? "bg-chart-1/10" : "bg-destructive/10"
  const borderColor =
    score >= 80 ? "border-chart-2" : score >= 60 ? "border-chart-1" : "border-destructive"

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-24 h-24 rounded-full border-4 ${borderColor} ${bgColor} flex flex-col items-center justify-center`}
      >
        <span className={`text-2xl font-bold ${color}`}>{score}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  )
}

function AnalysisResult({ analysis }: { analysis: VideoAnalysisRow }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  if (analysis.status !== "COMPLETE" || !analysis.qualityScore || !analysis.engagementScore) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Scores */}
      <div className="flex justify-center gap-8">
        <ScoreRing score={analysis.qualityScore} label="Quality" />
        <ScoreRing score={analysis.engagementScore} label="Engagement" />
      </div>

      {/* Recommendations grouped by category */}
      {analysis.recommendations && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Recommendations
          </h4>
          {analysis.recommendations.map((rec) => (
            <button
              key={rec.category}
              className="w-full text-left"
              onClick={() =>
                setExpandedCategory(expandedCategory === rec.category ? null : rec.category)
              }
            >
              <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 transition-colors duration-200">
                <span className="text-sm font-medium">{rec.category}</span>
                <span className="text-xs text-muted-foreground">
                  {expandedCategory === rec.category ? "▲" : "▼"}
                </span>
              </div>
              {expandedCategory === rec.category && (
                <div className="px-4 py-3 border border-t-0 border-border/50 rounded-b-lg bg-card/20">
                  <p className="text-sm text-muted-foreground">{rec.tip}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function VideoAnalyzer() {
  const [history, setHistory] = useState<VideoAnalysisRow[]>([])
  const [latestResult, setLatestResult] = useState<VideoAnalysisRow | null>(null)
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AnalyzeInput>({
    resolver: zodResolver(analyzeSchema),
  })

  useEffect(() => {
    fetch("/api/dashboard/video-analyses")
      .then((r) => r.json())
      .then((data: VideoAnalysisRow[]) => setHistory(data))
      .catch(() => {})
  }, [])

  const onSubmit = async (data: AnalyzeInput) => {
    const res = await fetch("/api/dashboard/video-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const result = (await res.json()) as VideoAnalysisRow
      setLatestResult(result)
      setHistory((prev) => [result, ...prev])
      reset()
      toast({ title: "Analysis complete", description: "Your video has been analyzed." })
    } else {
      const err = (await res.json()) as { error?: string }
      toast({
        title: "Analysis failed",
        description: err.error || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-linear-to-br from-chart-3/10 to-transparent opacity-50" />
        <div className="relative space-y-4">
          <h3 className="text-lg font-semibold">Analyze a Video</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <Input
                {...register("videoUrl")}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isSubmitting}
              />
              {errors.videoUrl && (
                <p className="text-xs text-destructive">{errors.videoUrl.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Notes <span className="text-xs">(optional)</span>
              </label>
              <Textarea
                {...register("notes")}
                placeholder="Any context about this video (property type, target audience, etc.)"
                rows={2}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full group relative overflow-hidden">
              <span className="relative flex items-center gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Analyzing..." : "Analyze Video"}
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </form>
        </div>
      </div>

      {/* Latest result */}
      {latestResult && latestResult.status === "COMPLETE" && (
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
          <div className="absolute inset-0 bg-linear-to-br from-chart-2/10 to-transparent opacity-50" />
          <div className="relative">
            <h3 className="text-lg font-semibold mb-4">Latest Analysis</h3>
            <AnalysisResult analysis={latestResult} />
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Analysis History</h3>
          {history.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
              <button
                className="relative w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-accent/20 transition-colors duration-200"
                onClick={() =>
                  setExpandedHistoryId(expandedHistoryId === item.id ? null : item.id)
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge
                    variant={
                      item.status === "COMPLETE"
                        ? "default"
                        : item.status === "FAILED"
                        ? "destructive"
                        : "secondary"
                    }
                    className="shrink-0 text-xs"
                  >
                    {item.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground truncate">{item.videoUrl}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </span>
              </button>

              {expandedHistoryId === item.id && item.status === "COMPLETE" && (
                <div className="relative p-4 border-t border-border/50">
                  <AnalysisResult analysis={item} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
