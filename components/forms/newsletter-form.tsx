"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Loader2, Mail, Check, ArrowRight } from "lucide-react"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterFormProps {
  className?: string
  variant?: "default" | "compact"
}

export function NewsletterForm({ className, variant = "default" }: NewsletterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to subscribe")
      }

      setIsSuccess(true)
      reset()

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl bg-accent/50 border border-border/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
          className
        )}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Check className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">You're subscribed!</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Check your inbox for confirmation.
          </p>
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-3", className)}>
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                className={cn(
                  "pl-10 h-10 transition-all duration-200",
                  errors.email && "border-destructive ring-destructive/20"
                )}
                disabled={isLoading}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                {errors.email.message}
              </p>
            )}
            {error && (
              <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 group relative overflow-hidden"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
            <span className="sr-only">Subscribe</span>
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      <div className="space-y-2 group">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input
            type="email"
            placeholder="Enter your email address"
            className={cn(
              "pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-ring/20",
              errors.email && "border-destructive ring-destructive/20"
            )}
            disabled={isLoading}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
            {errors.email.message}
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 group relative overflow-hidden"
        disabled={isLoading}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span className="relative font-medium">Subscribe to Newsletter</span>
            <ArrowRight className="ml-2 h-4 w-4 relative transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Get the latest updates, tips, and exclusive content delivered to your inbox.
      </p>
    </form>
  )
}
