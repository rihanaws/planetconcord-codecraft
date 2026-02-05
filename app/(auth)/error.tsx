"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 text-center">
            <div className="absolute inset-0 bg-linear-to-br from-destructive/5 to-transparent" />

            <div className="relative space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376a12 12 0 1 0 20.817 0M12 15.75h.008v.008H12v-.008z" />
                </svg>
              </div>

              <div>
                <h1 className="text-xl font-semibold">Authentication error</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Something went wrong during authentication.
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Try again
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-card/50 hover:bg-accent/30 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
