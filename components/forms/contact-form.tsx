"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, Send, Check, Mail, User, MessageSquare } from "lucide-react"
import { useRecaptcha } from "@/hooks/use-recaptcha"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const { executeRecaptcha } = useRecaptcha()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const recaptchaToken = await executeRecaptcha("CONTACT")

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message")
      }

      setIsSuccess(true)
      reset()

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
      <div className="p-8 rounded-2xl bg-accent/50 border border-border/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Message sent successfully!</p>
            <p className="text-sm text-muted-foreground mt-1">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2 group">
          <Label htmlFor="name" className="text-sm font-medium">
            Your Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <Input
              id="name"
              placeholder="John Doe"
              className={cn(
                "pl-10 h-11 transition-all duration-200",
                errors.name && "border-destructive ring-destructive/20"
              )}
              disabled={isLoading}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2 group">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={cn(
                "pl-10 h-11 transition-all duration-200",
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
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2 group">
        <Label htmlFor="subject" className="text-sm font-medium">
          Subject
        </Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input
            id="subject"
            placeholder="How can we help you?"
            className={cn(
              "pl-10 h-11 transition-all duration-200",
              errors.subject && "border-destructive ring-destructive/20"
            )}
            disabled={isLoading}
            {...register("subject")}
          />
        </div>
        {errors.subject && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2 group">
        <Label htmlFor="message" className="text-sm font-medium">
          Message
        </Label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell us more about your inquiry..."
          className={cn(
            "w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-all duration-200 outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:pointer-events-none disabled:opacity-50",
            errors.message && "border-destructive ring-destructive/20"
          )}
          disabled={isLoading}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full h-12 group relative overflow-hidden"
        disabled={isLoading}
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="h-5 w-5 mr-2 relative" />
            <span className="relative font-semibold">Send Message</span>
          </>
        )}
      </Button>
    </form>
  )
}
