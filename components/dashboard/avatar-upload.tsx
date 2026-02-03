"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  currentImage: string | null
  userName: string | null
  userId: string
}

export function AvatarUpload({ currentImage, userName, userId }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage)
  const { toast } = useToast()

  const getUserInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append("file", file)

      // Upload to API
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload avatar")
      }

      const data = await response.json()

      // Update preview
      setPreviewUrl(data.url)

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-24 w-24 ring-4 ring-border">
        <AvatarImage src={previewUrl || undefined} />
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
          {getUserInitials(userName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div>
          <p className="text-sm font-medium">Profile Photo</p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>

        <div className="flex gap-2">
          <label htmlFor="avatar-upload">
            <Button
              type="button"
              size="sm"
              disabled={isUploading}
              variant="outline"
              className="cursor-pointer"
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  )
}
