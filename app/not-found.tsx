import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-lg mx-auto">
            {/* Glass card */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-10 text-center">
              {/* Atmospheric gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-accent/10" />

              <div className="relative space-y-6">
                {/* Large 404 */}
                <div className="relative">
                  <span className="text-[9rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground/80 to-foreground/20">
                    404
                  </span>
                </div>

                {/* Icon + heading */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
                  <p className="text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-12 h-px bg-border mx-auto" />

                {/* Quick links */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Where would you like to go?</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/30 px-5 py-2.5 text-sm font-medium transition-colors duration-200"
                    >
                      Home
                    </Link>
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/30 px-5 py-2.5 text-sm font-medium transition-colors duration-200"
                    >
                      Products
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/30 px-5 py-2.5 text-sm font-medium transition-colors duration-200"
                    >
                      Contact Us
                    </Link>
                  </div>
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
