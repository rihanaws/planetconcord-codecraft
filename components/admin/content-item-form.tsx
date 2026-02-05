"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"

const contentFormSchema = z.object({
  type: z.enum(["FILE", "LINK", "TEXT", "VIDEO"]),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  linkUrl: z.string().optional(),
  textContent: z.string().optional(),
  videoUrl: z.string().optional(),
})

type ContentFormValues = z.infer<typeof contentFormSchema>

interface ContentItemFormProps {
  productId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ContentItemForm({ productId, onSuccess, onCancel }: ContentItemFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      type: "FILE",
      title: "",
      description: "",
    },
  })

  const contentType = watch("type")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB allowed", variant: "destructive" })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/user/avatar", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      const data: { url?: string } = await res.json()
      if (data.url) {
        setValue("fileUrl", data.url)
        setValue("fileName", file.name)
        setValue("fileSize", file.size)
      }
    } else {
      toast({ title: "Upload failed", description: "Could not upload file", variant: "destructive" })
    }

    setIsUploading(false)
  }

  const onSubmit = async (values: ContentFormValues) => {
    // Client-side type-specific validation
    if (values.type === "FILE" && !values.fileUrl) {
      toast({ title: "Missing file", description: "Please upload a file", variant: "destructive" })
      return
    }
    if (values.type === "LINK" && !values.linkUrl) {
      toast({ title: "Missing URL", description: "Please enter a link URL", variant: "destructive" })
      return
    }
    if (values.type === "TEXT" && !values.textContent) {
      toast({ title: "Missing content", description: "Please enter text content", variant: "destructive" })
      return
    }
    if (values.type === "VIDEO" && !values.videoUrl) {
      toast({ title: "Missing URL", description: "Please enter a video URL", variant: "destructive" })
      return
    }

    setIsLoading(true)

    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...values }),
    })

    if (res.ok) {
      toast({ title: "Content added", description: `"${values.title}" has been created.` })
      onSuccess()
    } else {
      const data: { error?: string } = await res.json()
      toast({ title: "Failed", description: data.error || "Something went wrong", variant: "destructive" })
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Type selector */}
      <div className="space-y-2">
        <Label>Content Type</Label>
        <Select
          value={contentType}
          onValueChange={(val) => setValue("type", val as "FILE" | "LINK" | "TEXT" | "VIDEO")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FILE">File (Download)</SelectItem>
            <SelectItem value="LINK">External Link</SelectItem>
            <SelectItem value="TEXT">Text / Markdown</SelectItem>
            <SelectItem value="VIDEO">Video (YouTube / Vimeo)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g. Email Templates Bundle" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description (optional) */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" placeholder="Brief description of this content" {...register("description")} />
      </div>

      {/* Type-specific fields */}
      {contentType === "FILE" && (
        <div className="space-y-2">
          <Label>File Upload</Label>
          <div className="border border-dashed border-border rounded-lg p-4 text-center">
            {watch("fileUrl") ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-chart-2">{watch("fileName") || "File uploaded"}</p>
                <p className="text-xs text-muted-foreground">
                  {watch("fileSize") != null ? `${((watch("fileSize") as number) / 1024).toFixed(1)} KB` : ""}
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => { setValue("fileUrl", ""); setValue("fileName", ""); setValue("fileSize", undefined) }}>
                  Change File
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload file (max 5MB)</p>
                </div>
                <input type="file" className="sr-only" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            )}
            {isUploading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
          </div>
        </div>
      )}

      {contentType === "LINK" && (
        <div className="space-y-2">
          <Label htmlFor="linkUrl">Link URL</Label>
          <Input id="linkUrl" placeholder="https://example.com/resource" {...register("linkUrl")} />
        </div>
      )}

      {contentType === "TEXT" && (
        <div className="space-y-2">
          <Label htmlFor="textContent">Text Content (Markdown)</Label>
          <textarea
            id="textContent"
            rows={6}
            placeholder="Write your content here. Markdown is supported."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            {...register("textContent")}
          />
        </div>
      )}

      {contentType === "VIDEO" && (
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input id="videoUrl" placeholder="https://youtube.com/watch?v=..." {...register("videoUrl")} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isLoading || isUploading} className="group relative overflow-hidden">
          <span className="relative flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Content
          </span>
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Button>
      </div>
    </form>
  )
}
