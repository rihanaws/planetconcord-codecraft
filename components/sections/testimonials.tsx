"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "The Email Newsletter Starter Pack transformed our marketing strategy. We saw a 300% increase in engagement within the first month. Absolutely worth every penny!",
    author: "Sarah Chen",
    role: "Marketing Director",
    company: "GrowthLab Inc.",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "Outstanding quality and support. The Landing Page CRO Boost helped us double our conversion rate. The templates are beautifully designed and easy to customize.",
    author: "Michael Rodriguez",
    role: "Founder & CEO",
    company: "StartupFlow",
    avatar: "MR",
    rating: 5,
  },
  {
    quote: "Best investment we made this year. The Shopify Speed Surge optimized our store performance dramatically. Page load times decreased by 60%, sales increased by 45%.",
    author: "Emily Watson",
    role: "E-commerce Manager",
    company: "StyleHub Co.",
    avatar: "EW",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-muted/10 via-background to-muted/10" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              What Our Customers
            </span>
            <br />
            <span className="bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of satisfied customers who have transformed their businesses
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              10,000+
            </div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              4.9/5
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              99%
            </div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: typeof testimonials[0]
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
      {/* Quote icon */}
      <div className="absolute -top-3 -left-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md" />
          <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-card border border-border/50">
            <Quote className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Rating stars */}
      <div className="flex items-center gap-1 mb-4 mt-2">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-primary fill-primary" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-sm text-foreground/90 leading-relaxed mb-6 italic">
        &quot;{testimonial.quote}&quot;
      </blockquote>

      {/* Author info */}
      <div className="flex items-center gap-4 pt-4 border-t border-border/50">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-accent/20 border border-border/50">
            <span className="text-sm font-semibold text-primary">
              {testimonial.avatar}
            </span>
          </div>
        </div>

        {/* Name and role */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors duration-200">
            {testimonial.author}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {testimonial.role}
          </div>
          <div className="text-xs text-muted-foreground/80 truncate">
            {testimonial.company}
          </div>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </div>
  )
}
