"use client"

import { useState, useEffect, useCallback } from "react"

const CONSENT_KEY = "codecraft-consent"

export interface ConsentPreferences {
  analytics: boolean
}

export interface ConsentState {
  /** null = not yet decided (banner should show), object = decided */
  preferences: ConsentPreferences | null
  /** Call to accept all non-essential categories */
  acceptAll: () => void
  /** Call to reject all non-essential categories */
  rejectAll: () => void
  /** Call to save custom preferences */
  savePreferences: (prefs: ConsentPreferences) => void
}

function persist(prefs: ConsentPreferences) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
  } catch {}
}

function read(): ConsentPreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (raw) return JSON.parse(raw) as ConsentPreferences
  } catch {}
  return null
}

/** Fire GTM consent update when preferences change */
function pushConsentToGtm(prefs: ConsentPreferences) {
  if (typeof window === "undefined") return
  const w = window as unknown as { dataLayer?: Array<unknown> }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({
    event: "consent_update",
    "gtag.js": {
      consent: {
        analytics_storage: prefs.analytics ? "granted" : "denied",
      },
    },
  })
  // Also call gtag directly if available (works with gtag.js loaded by GTM)
  if (typeof (window as unknown as { gtag?: unknown }).gtag === "function") {
    ;(window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      "consent",
      "update",
      { analytics_storage: prefs.analytics ? "granted" : "denied" }
    )
  }
}

export function useConsent(): ConsentState {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = read()
    if (stored) {
      setPreferences(stored)
      pushConsentToGtm(stored)
    }
    setHydrated(true)
  }, [])

  const acceptAll = useCallback(() => {
    const prefs: ConsentPreferences = { analytics: true }
    persist(prefs)
    setPreferences(prefs)
    pushConsentToGtm(prefs)
  }, [])

  const rejectAll = useCallback(() => {
    const prefs: ConsentPreferences = { analytics: false }
    persist(prefs)
    setPreferences(prefs)
    pushConsentToGtm(prefs)
  }, [])

  const savePreferences = useCallback((prefs: ConsentPreferences) => {
    persist(prefs)
    setPreferences(prefs)
    pushConsentToGtm(prefs)
  }, [])

  // Before hydration, treat as null so banner doesn't flash then disappear
  return {
    preferences: hydrated ? preferences : null,
    acceptAll,
    rejectAll,
    savePreferences,
  }
}
