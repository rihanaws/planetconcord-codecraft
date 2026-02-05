"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const serviceRequestSchema = z.object({
  shopifyUrl: z.string().url("Must be a valid URL"),
  notes: z.string().optional(),
  mustKeepApps: z.string().optional(),
})

type ServiceRequestInput = z.infer<typeof serviceRequestSchema>

interface ServiceRequestRow {
  id: string
  shopifyUrl: string
  notes: string | null
  mustKeepApps: string | null
  status: "PENDING" | "IN_PROGRESS" | "COMPLETE" | "CANCELLED"
  reportUrl: string | null
  reportFileName: string | null
  createdAt: string
  product: { name: string } | null
}

interface ServiceRequestFormProps {
  onSubmit: (item: ServiceRequestRow) => void
  onCancel: () => void
}

export function ServiceRequestForm({ onSubmit, onCancel }: ServiceRequestFormProps) {
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
  })

  const submit = async (data: ServiceRequestInput) => {
    const res = await fetch("/api/dashboard/service-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const created = (await res.json()) as ServiceRequestRow
      toast({ title: "Request submitted", description: "Your store has been added to the queue." })
      onSubmit(created)
    } else {
      const err = (await res.json()) as { error?: string }
      toast({
        title: "Failed to submit",
        description: err.error || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
      <div className="absolute inset-0 bg-linear-to-br from-chart-4/10 to-transparent opacity-50" />
      <div className="relative space-y-4">
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Shopify Store URL</label>
            <Input
              {...register("shopifyUrl")}
              placeholder="https://yourstore.myshopify.com"
              disabled={isSubmitting}
            />
            {errors.shopifyUrl && (
              <p className="text-xs text-destructive">{errors.shopifyUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Notes <span className="text-xs">(optional)</span>
            </label>
            <Textarea
              {...register("notes")}
              placeholder="Any specific requirements or context"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Must-Keep Apps <span className="text-xs">(optional)</span>
            </label>
            <Textarea
              {...register("mustKeepApps")}
              placeholder="List apps you want to keep, one per line"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1 group relative overflow-hidden">
              <span className="relative flex items-center gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
