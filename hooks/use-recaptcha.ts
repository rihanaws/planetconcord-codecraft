"use client"

import { useCallback } from "react"

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (cb: () => void) => void
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

/**
 * Client-side hook to execute reCAPTCHA Enterprise.
 * The script is loaded globally in app/layout.tsx.
 */
export function useRecaptcha() {
  const executeRecaptcha = useCallback(async (action: string): Promise<string> => {
    if (!window.grecaptcha?.enterprise) {
      throw new Error("reCAPTCHA not loaded")
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha!.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha!.enterprise.execute(SITE_KEY, { action })
          resolve(token)
        } catch (err) {
          reject(err)
        }
      })
    })
  }, [])

  return { executeRecaptcha }
}
