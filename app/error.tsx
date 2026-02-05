"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

export default function RootError({
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
    <>
      <Header />
      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-10 text-center">
              <div className="absolute inset-0 bg-linear-to-br from-destructive/5 via-transparent to-muted/10" />

              <div className="relative space-y-6">
                {/* Error icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376a12 12 0 1 0 20.817 0M12 15.75h.008v.008H12v-.008z" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
                  <p className="text-muted-foreground">
                    An unexpected error occurred. We&apos;ve logged it and are looking into it.
                  </p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground font-mono mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>

                <div className="w-12 h-px bg-border mx-auto" />

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={reset}
                    className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 text-sm font-medium transition-colors duration-200"
                  >
                    Try again
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-card/50 hover:bg-accent/30 px-5 py-2.5 text-sm font-medium transition-colors duration-200"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
