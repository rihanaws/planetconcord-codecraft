"use client"

import { HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductFAQProps {
  faqs: Array<{ question: string; answer: string }>
}

export function ProductFAQ({ faqs }: ProductFAQProps) {
  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Product FAQ</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Common Questions
            </span>
          </h2>
        </div>

        <div className="relative">
          <div className="p-8 md:p-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
            <Accordion type="single" collapsible className="w-full space-y-1">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group border-b border-border/50 last:border-b-0 transition-colors duration-200 hover:border-border"
                >
                  <AccordionTrigger className="py-5 px-4 -mx-4 rounded-lg hover:bg-accent/30 hover:no-underline transition-all duration-200 text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 -mx-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
