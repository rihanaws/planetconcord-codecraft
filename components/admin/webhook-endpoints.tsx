"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink, CheckCircle2 } from "lucide-react"

const ENDPOINTS = [
  {
    label: "Whop Webhook URL",
    url: "https://codecraft.techsci.xyz/api/webhooks/whop",
    description: "Receives payment.succeeded, membership.went_valid, membership.went_invalid, payment.refunded",
  },
  {
    label: "PayPal Webhook URL",
    url: "https://codecraft.techsci.xyz/api/webhooks/paypal",
    description: "Receives PAYMENT.SALE.COMPLETED, PAYMENT.SALE.REFUNDED",
  },
] as const

export function WebhookEndpoints() {
  const { toast } = useToast()

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "URL copied to clipboard." })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
      <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

      <div className="relative space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Webhook Endpoints</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure these URLs in your payment provider dashboards.
          </p>
        </div>

        {ENDPOINTS.map((endpoint) => (
          <div key={endpoint.label} className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">{endpoint.label}</span>
            </div>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 text-xs font-mono bg-muted/50 rounded-lg border border-border/50 truncate flex items-center">
                {endpoint.url}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="h-9 shrink-0"
                onClick={() => handleCopy(endpoint.url)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{endpoint.description}</p>
          </div>
        ))}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">PayPal Webhook ID</span>
          </div>
          <code className="block px-3 py-2 text-xs font-mono bg-muted/50 rounded-lg border border-border/50">
            8ED47441RE716080D
          </code>
        </div>
      </div>
    </div>
  )
}
