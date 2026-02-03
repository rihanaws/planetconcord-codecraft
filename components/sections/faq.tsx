"use client"

import { HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What types of products do you offer?",
    answer:
      "We offer premium digital products across three main categories: Marketing (email newsletters, landing pages, social media calendars), Analytics (AI-powered video reviews, data insights), and Development (performance optimization, technical solutions). All products are designed to help businesses grow and scale efficiently.",
  },
  {
    question: "How does pricing work? Are there any hidden fees?",
    answer:
      "We believe in transparent pricing with no hidden fees. Most products are available as one-time purchases with lifetime access, while some premium tools offer optional monthly subscriptions. The price you see is the price you pay - no surprises, no recurring charges unless you choose a subscription plan.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee on all products. If you're not completely satisfied with your purchase, simply contact our support team within 30 days for a full refund - no questions asked. We want you to feel confident in your investment.",
  },
  {
    question: "How quickly will I receive my products after purchase?",
    answer:
      "Instant delivery! Once your payment is processed, you&apos;ll immediately receive access to your purchased products via email and your customer dashboard. No waiting periods, no shipping delays - start using your products within minutes of purchase.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "All customers receive premium support from our expert team. We offer email support with typical response times under 24 hours, comprehensive documentation, video tutorials, and a knowledge base. Premium product buyers also get priority support and access to our community forum.",
  },
  {
    question: "Do I get free updates and improvements?",
    answer:
      "Absolutely! All purchases include lifetime updates at no additional cost. As we improve our products, add new features, or release updated versions, you&apos;ll automatically get access to everything. Once you buy, you own that product forever with all future enhancements included.",
  },
]

export function FAQ() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      </div>

      <div className="container mx-auto max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">FAQ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about our products and services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="relative">
          <div className="p-8 md:p-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
            <Accordion type="single" collapsible className="w-full space-y-1">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group border-b border-border/50 last:border-b-0 transition-colors duration-200 hover:border-border"
                >
                  <AccordionTrigger className="py-5 px-4 -mx-4 rounded-lg hover:bg-accent/30 hover:no-underline transition-all duration-200 text-base font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 -mx-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Decorative glow */}
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl blur-2xl -z-10 opacity-50" />
        </div>

        {/* CTA below FAQ */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200 group"
          >
            <span>Contact our support team</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
