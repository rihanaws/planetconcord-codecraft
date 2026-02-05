"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Loader2, Plus, Trash2 } from "lucide-react"

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  description: z.string().min(1, "Description is required"),
  shortDesc: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  pricingType: z.enum(["ONE_TIME", "SUBSCRIPTION"]),
  category: z.string().min(1, "Category is required"),
  whopProductId: z.string().optional(),
  whopCheckoutUrl: z.string().optional(),
  discordInviteUrl: z.string().optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  defaultValues?: ProductFormValues & {
    id?: string
    deliverables?: string[]
    features?: string[]
    requirements?: string[]
    faq?: { question: string; answer: string }[]
  }
  mode: "create" | "edit"
}

export function ProductForm({ defaultValues, mode }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // JSON array fields managed separately
  const [deliverables, setDeliverables] = useState<string[]>(
    defaultValues?.deliverables || []
  )
  const [features, setFeatures] = useState<string[]>(
    defaultValues?.features || []
  )
  const [requirements, setRequirements] = useState<string[]>(
    defaultValues?.requirements || []
  )
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>(
    defaultValues?.faq || []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "",
      description: "",
      shortDesc: "",
      price: 0,
      pricingType: "ONE_TIME",
      category: "",
      whopProductId: "",
      whopCheckoutUrl: "",
      discordInviteUrl: "",
      featured: false,
      popular: false,
    },
  })

  // Auto-generate slug from name (create mode only)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue("name", val)
    if (mode === "create") {
      setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
    }
  }

  // --- Array field helpers ---
  const addStringItem = (list: string[], setList: (v: string[]) => void) => {
    setList([...list, ""])
  }
  const updateStringItem = (list: string[], setList: (v: string[]) => void, index: number, value: string) => {
    const updated = [...list]
    updated[index] = value
    setList(updated)
  }
  const removeStringItem = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  const addFaqItem = () => {
    setFaq([...faq, { question: "", answer: "" }])
  }
  const updateFaqItem = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faq]
    updated[index] = { ...updated[index], [field]: value }
    setFaq(updated)
  }
  const removeFaqItem = (index: number) => {
    setFaq(faq.filter((_, i) => i !== index))
  }

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true)

    const payload = {
      ...values,
      deliverables: deliverables.filter(Boolean),
      features: features.filter(Boolean),
      requirements: requirements.filter(Boolean),
      faq: faq.filter((f) => f.question && f.answer),
    }

    const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${defaultValues?.id}`
    const method = mode === "create" ? "POST" : "PUT"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      toast({
        title: mode === "create" ? "Product created" : "Product updated",
        description: `"${values.name}" has been ${mode === "create" ? "created" : "saved"}.`,
      })
      router.push("/admin/products")
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-6">
          <h3 className="text-xl font-semibold">Basic Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g. Email Newsletter Starter Pack"
                {...register("name")}
                onChange={handleNameChange}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="e.g. email-newsletter-starter-pack"
                {...register("slug")}
                disabled={mode === "edit"}
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Full product description..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDesc">Short Description (optional)</Label>
            <Input
              id="shortDesc"
              placeholder="Brief summary shown on listing page"
              {...register("shortDesc")}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Category */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-6">
          <h3 className="text-xl font-semibold">Pricing & Category</h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="149.00"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Pricing Type</Label>
              <Select
                value={watch("pricingType")}
                onValueChange={(val) => setValue("pricingType", val as "ONE_TIME" | "SUBSCRIPTION")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_TIME">One-Time</SelectItem>
                  <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Marketing"
                {...register("category")}
              />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
          </div>

          {/* Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-input"
                {...register("featured")}
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-input"
                {...register("popular")}
              />
              <span className="text-sm font-medium">Popular</span>
            </label>
          </div>
        </div>
      </div>

      {/* Whop Integration */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-6">
          <h3 className="text-xl font-semibold">Whop Integration</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="whopProductId">Whop Product ID (optional)</Label>
              <Input id="whopProductId" placeholder="prod_..." {...register("whopProductId")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whopCheckoutUrl">Whop Checkout URL (optional)</Label>
              <Input id="whopCheckoutUrl" placeholder="https://whop.com/..." {...register("whopCheckoutUrl")} />
            </div>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-6">
          <h3 className="text-xl font-semibold">Community</h3>

          <div className="space-y-2">
            <Label htmlFor="discordInviteUrl">Discord Invite URL (optional)</Label>
            <Input id="discordInviteUrl" placeholder="https://discord.gg/xxxxx" {...register("discordInviteUrl")} />
            <p className="text-xs text-muted-foreground">Buyers will see this link in their dashboard and purchase confirmation email.</p>
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Deliverables</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => addStringItem(deliverables, setDeliverables)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {deliverables.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  placeholder="e.g. Email templates bundle"
                  onChange={(e) => updateStringItem(deliverables, setDeliverables, i, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeStringItem(deliverables, setDeliverables, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {deliverables.length === 0 && <p className="text-sm text-muted-foreground">No deliverables added yet.</p>}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Features</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => addStringItem(features, setFeatures)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {features.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  placeholder="e.g. Step-by-step guide included"
                  onChange={(e) => updateStringItem(features, setFeatures, i, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeStringItem(features, setFeatures, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {features.length === 0 && <p className="text-sm text-muted-foreground">No features added yet.</p>}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Requirements</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => addStringItem(requirements, setRequirements)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {requirements.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  placeholder="e.g. Basic email marketing knowledge"
                  onChange={(e) => updateStringItem(requirements, setRequirements, i, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeStringItem(requirements, setRequirements, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {requirements.length === 0 && <p className="text-sm text-muted-foreground">No requirements added yet.</p>}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">FAQ</h3>
            <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="space-y-2 p-4 rounded-lg bg-accent/30 border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Q{i + 1}</span>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFaqItem(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  value={item.question}
                  placeholder="Question..."
                  onChange={(e) => updateFaqItem(i, "question", e.target.value)}
                />
                <textarea
                  rows={2}
                  value={item.answer}
                  placeholder="Answer..."
                  onChange={(e) => updateFaqItem(i, "answer", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
            ))}
            {faq.length === 0 && <p className="text-sm text-muted-foreground">No FAQ items added yet.</p>}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="group relative overflow-hidden">
          <span className="relative flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Product" : "Save Changes"}
          </span>
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Button>
      </div>
    </form>
  )
}
