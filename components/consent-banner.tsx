"use client"

import { useState } from "react"
import { useConsent, type ConsentPreferences } from "@/hooks/use-consent"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield } from "lucide-react"

export function ConsentBanner() {
  const { preferences, acceptAll, rejectAll, savePreferences } = useConsent()
  const [showPrefs, setShowPrefs] = useState(false)
  const [draft, setDraft] = useState<ConsentPreferences>({ analytics: false })

  // Already decided — don't render
  if (preferences !== null) return null

  const handleManage = () => {
    setShowPrefs(true)
  }

  const handleSave = () => {
    savePreferences(draft)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg shadow-primary/5 transition-all duration-300">
        {!showPrefs ? (
          /* ── Default banner ── */
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-start gap-3 flex-1">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                We use cookies to improve your experience. Essential cookies are
                always on. We ask your permission before using analytics cookies
                to track page views and traffic sources.{" "}
                <a
                  href="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button size="sm" onClick={acceptAll}>
                Accept All
              </Button>
              <Button size="sm" variant="outline" onClick={handleManage}>
                Preferences
              </Button>
              <Button size="sm" variant="ghost" onClick={rejectAll}>
                Reject All
              </Button>
            </div>
          </div>
        ) : (
          /* ── Preferences panel ── */
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">Cookie Preferences</h3>
            </div>

            {/* Essential — always on, disabled toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4">
              <div>
                <p className="text-sm font-medium">Essential</p>
                <p className="text-xs text-muted-foreground">
                  Required for login, security, and site functionality. Cannot be
                  disabled.
                </p>
              </div>
              <Switch checked disabled />
            </div>

            {/* Analytics — toggleable */}
            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4">
              <div>
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground">
                  Helps us understand how visitors use the site. Includes page
                  views and traffic sources via Google Analytics.
                </p>
              </div>
              <Switch
                checked={draft.analytics}
                onCheckedChange={(checked) =>
                  setDraft((prev) => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowPrefs(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
