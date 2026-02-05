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
import { Loader2 } from "lucide-react"

const newsFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Body is required"),
  productId: z.string().optional(),
  published: z.boolean(),
})

type NewsFormValues = z.infer<typeof newsFormSchema>

interface NewsItemRow {
  id: string
  title: string
  body: string
  productId: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  product: { id: string; name: string } | null
}

interface NewsFormProps {
  products: { id: string; name: string }[]
  defaultValues?: NewsItemRow
  onSubmit: (item: NewsItemRow) => void
  onCancel: () => void
}

export function NewsForm({ products, defaultValues, onSubmit, onCancel }: NewsFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const isEdit = !!defaultValues

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          body: defaultValues.body,
          productId: defaultValues.productId || "",
          published: defaultValues.published,
        }
      : {
          title: "",
          body: "",
          productId: "",
          published: false,
        },
  })

  const onFormSubmit = async (values: NewsFormValues) => {
    setIsLoading(true)

    const payload = {
      title: values.title,
      body: values.body,
      productId: values.productId || undefined,
      published: values.published,
    }

    const url = isEdit ? `/api/admin/news/${defaultValues.id}` : "/api/admin/news"
    const method = isEdit ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data: NewsItemRow = await res.json()
      onSubmit(data)
    } else {
      const data: { error?: string } = await res.json()
      toast({
        title: "Failed",
        description: data.error || "Something went wrong",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Content */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-6">
          <h3 className="text-xl font-semibold">Content</h3>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. New feature announcement"
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              rows={5}
              placeholder="Write your news content here..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              {...register("body")}
            />
            {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-6">
          <h3 className="text-xl font-semibold">Settings</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select
                value={watch("productId") || "GLOBAL"}
                onValueChange={(val) => setValue("productId", val === "GLOBAL" ? "" : val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">Global (all customers)</SelectItem>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Global news is visible to all customers. Product-specific news is only visible to buyers of that product.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-input"
                    {...register("published")}
                  />
                  <span className="text-sm font-medium">Published</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {watch("published") ? "Visible to customers" : "Draft — not visible"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="group relative overflow-hidden">
          <span className="relative flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create News Item"}
          </span>
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Button>
      </div>
    </form>
  )
}
