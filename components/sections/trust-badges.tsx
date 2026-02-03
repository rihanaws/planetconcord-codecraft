"use client"

import { Shield, Lock, CheckCircle, Award, Zap, RefreshCw } from "lucide-react"

const badges = [
  {
    icon: Shield,
    label: "Secure Payments",
    description: "SSL encrypted",
  },
  {
    icon: Lock,
    label: "Privacy Protected",
    description: "Your data is safe",
  },
  {
    icon: CheckCircle,
    label: "Verified Products",
    description: "Quality guaranteed",
  },
  {
    icon: Award,
    label: "Award Winning",
    description: "Industry recognized",
  },
  {
    icon: Zap,
    label: "Instant Access",
    description: "No waiting time",
  },
  {
    icon: RefreshCw,
    label: "Free Updates",
    description: "Lifetime support",
  },
]

export function TrustBadges() {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Optional section label */}
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground font-medium">
            Trusted by 10,000+ businesses worldwide
          </p>
        </div>

        {/* Trust badges grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div
              key={badge.label}
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-border hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "backwards",
              }}
            >
              {/* Icon */}
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <badge.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>

              {/* Label */}
              <div className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors duration-200">
                {badge.label}
              </div>

              {/* Description */}
              <div className="text-xs text-muted-foreground">
                {badge.description}
              </div>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm">99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
            <span className="text-sm">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "1s" }} />
            <span className="text-sm">PCI DSS Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "1.5s" }} />
            <span className="text-sm">ISO 27001</span>
          </div>
        </div>
      </div>
    </section>
  )
}
