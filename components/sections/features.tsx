"use client"

import { Zap, Award, Infinity, Headphones, RefreshCw, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Access your products immediately after purchase. No waiting, no delays.",
    gradient: "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Meticulously crafted products that exceed industry standards.",
    gradient: "from-amber-500/10 via-orange-500/10 to-red-500/10",
  },
  {
    icon: Infinity,
    title: "Lifetime Access",
    description: "One-time payment for permanent access. No subscriptions or hidden fees.",
    gradient: "from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Dedicated support team ready to help you succeed at every step.",
    gradient: "from-emerald-500/10 via-green-500/10 to-lime-500/10",
  },
  {
    icon: RefreshCw,
    title: "Regular Updates",
    description: "Continuous improvements and new features at no additional cost.",
    gradient: "from-sky-500/10 via-blue-500/10 to-indigo-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Money-Back Guarantee",
    description: "Not satisfied? Get a full refund within 30 days, no questions asked.",
    gradient: "from-rose-500/10 via-pink-500/10 to-red-500/10",
  },
]

export function Features() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Why Choose Us</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Everything You Need to
            </span>
            <br />
            <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              Succeed & Grow
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Premium digital products backed by guarantees that matter
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  index,
}: {
  icon: React.ElementType
  title: string
  description: string
  gradient: string
  index: number
}) {
  return (
    <div
      className="group relative p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-border hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Icon container */}
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </div>
  )
}
