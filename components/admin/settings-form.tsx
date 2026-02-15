"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Copy, Save, Loader2 } from "lucide-react"

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

const SETTING_FIELDS = [
  { key: "whop_api_key", label: "Whop API Key", placeholder: "Enter your Whop API key" },
  { key: "whop_webhook_secret", label: "Webhook Secret", placeholder: "Enter your Whop webhook secret" },
  { key: "whop_company_id", label: "Company ID", placeholder: "Enter your Whop company ID" },
] as const

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialSettings)
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSave = async (key: string) => {
    setSaving(key)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: values[key] || "" }),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast({ title: "Saved", description: `${key.replace(/_/g, " ")} updated successfully.` })
    } catch {
      toast({ title: "Error", description: "Failed to save setting.", variant: "destructive" })
    } finally {
      setSaving(null)
    }
  }

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast({ title: "Copied", description: "Value copied to clipboard." })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
      <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

      <div className="relative space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Whop Global Credentials</h2>
          <p className="text-sm text-muted-foreground mt-1">
            These credentials are used for webhook verification and API calls. DB values override environment variables.
          </p>
        </div>

        {SETTING_FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id={field.key}
                  type={visible[field.key] ? "text" : "password"}
                  placeholder={field.placeholder}
                  value={values[field.key] || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="pr-20"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setVisible((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                  >
                    {visible[field.key] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  {values[field.key] && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy(values[field.key])}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                className="h-10"
              >
                {saving === field.key ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
