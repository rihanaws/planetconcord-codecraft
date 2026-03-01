import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RotateCcw, AlertTriangle, CheckCircle2, XCircle, Clock, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Return & Refund Policy | CodeCraft Agency (TechSci Inc.)",
  description: "Milestone-based refund policy for CodeCraft Agency digital marketing services.",
  openGraph: {
    title: "Return & Refund Policy | CodeCraft Agency (TechSci Inc.)",
    description: "Milestone-based refund policy for CodeCraft Agency digital marketing services.",
    url: "https://codecraft.techsci.xyz/refund",
    type: "website",
    images: [{ url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: "TechSci CodeCraft" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/CODE_CRAFT_LOGO.png"] },
}

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5 mb-6">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Refund Policy</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Return &amp; Refund Policy
                </span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Last updated: January 28, 2026 · CodeCraft Agency (TechSci Inc.) · EIN: 35-2800827
              </p>
            </div>

            <div className="space-y-6">

              {/* Refund Window */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Refund Request Window (Whop Requirement)</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Per Whop&apos;s Buyer Terms, all refund requests must be submitted within{" "}
                  <strong>30 days of purchase</strong> via the Whop Resolution Center. Requests submitted
                  after 30 days will not be honored.
                </p>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Important:</strong> Refunds are tied to deliverables
                    and project phases completed — not just time elapsed. Review your phase eligibility below.
                  </p>
                </div>
              </div>

              {/* Milestone Eligibility */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-6">Refund Eligibility (Milestone-Based)</h2>
                <div className="space-y-4">

                  <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Days 0–7 (First Week)</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Full refund minus <strong>$250 onboarding/setup fee</strong> if any of the following
                      occurred: kickoff call, onboarding questionnaire sent, project dashboard created, or
                      initial research begun. If none occurred: <strong>full refund, no fee.</strong>
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold">Days 8–14 (Second Week)</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>50% refund only if Phase 1 has not been started.</strong> If Phase 1 work has
                      begun (strategy research, competitive analysis, persona development), no refund applies
                      to Phase 1 value.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">After Phase 1 Delivered (Typically Days 10–15)</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Phase 1 is NON-REFUNDABLE</strong> — high-value intellectual work is complete:
                      marketing strategy document, competitive analysis, audience research, 90-day roadmap,
                      positioning framework.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Refund available only for undelivered phases. Silence after 5 business days of delivery
                      = deemed accepted. Example: $1,799 paid → $450 Phase 1 non-refundable →{" "}
                      <strong>max refund $1,349.</strong>
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">After Phase 2 Delivered (Typically Days 16–40)</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>No refunds.</strong> 90%+ of the package is complete: content kit, blog posts,
                      social graphics, lead magnets, ad campaigns, SEO optimization. Only training and
                      support remain (15% of value).
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">After 90 Days (Service Period Complete)</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>No refunds.</strong> All service obligations fulfilled per Whop&apos;s
                      one-time payment policy and our Terms of Service.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase Table */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Phase-Based Refund Calculation</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on Growth Accelerator Package ($1,799):
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 pr-4 font-semibold">Phase</th>
                        <th className="text-left py-2 pr-4 font-semibold">Value</th>
                        <th className="text-left py-2 font-semibold">Refundable?</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {[
                        ["Onboarding + Kickoff", "$250 (14%)", "Deducted from Days 0–7 refunds", "amber"],
                        ["Phase 1: Strategy", "$450 (25%)", "NO — intellectual work complete", "red"],
                        ["Phase 2: Content + Ads", "$1,080 (60%)", "NO — deliverables produced", "red"],
                        ["Phase 3: Training + Support", "$269 (15%)", "NO — service substantially complete", "red"],
                      ].map(([phase, value, refundable, color], i) => (
                        <tr key={i} className="border-b border-border/30 last:border-0">
                          <td className="py-2 pr-4">{phase}</td>
                          <td className="py-2 pr-4">{value}</td>
                          <td className={`py-2 font-medium ${color === "red" ? "text-red-500" : "text-amber-500"}`}>
                            {refundable}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* How to Request */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-6">How to Request a Refund</h2>
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Contact Us Directly First (Fastest)",
                      body: "Email hello@techsci.io with your Whop order ID, product name, and detailed reason. We respond within 24 hours and resolve 85% of issues without the Resolution Center.",
                    },
                    {
                      step: "2",
                      title: "Open Whop Resolution Center (If Not Resolved)",
                      body: "Log in to Whop → Orders → Find purchase → Request Refund. Select a reason, write a detailed explanation, and upload supporting evidence.",
                    },
                    {
                      step: "3",
                      title: "We Respond Within 7 Days",
                      body: "We accept, deny, or request more information. If unresolved after 7 days, you may escalate to Whop for independent review.",
                    },
                    {
                      step: "4",
                      title: "Approved Refunds Processed in 10 Business Days",
                      body: "Credit/Debit: 3–7 days. PayPal: 1–3 days. Whop Balance: instant.",
                    },
                  ].map(({ step, title, body }) => (
                    <div key={step} className="flex gap-3">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {step}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{title}</p>
                        <p className="text-sm text-muted-foreground">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Refundable */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Non-Refundable Situations</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Change of mind after kickoff call or Phase 1 delivery",
                    "Inability to implement deliverables (lack of time, technical skills, or resources)",
                    "External factors outside our control (market conditions, algorithm changes)",
                    "Client-caused delays — missed onboarding, not providing required access, missed calls",
                    "Dissatisfaction with results — we deliver strategy and content, not guaranteed outcomes",
                    "Refund requests submitted after 30 days (Whop platform requirement)",
                    "Chargebacks filed without first contacting us or using the Whop Resolution Center",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscriptions */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Subscription Product Refunds</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You may cancel anytime — no refund for the current billing period</li>
                  <li>• Cancel before your next billing date to avoid the next charge</li>
                  <li>• No prorated refunds for partial months or unused time</li>
                  <li>• Access continues until end of paid period; no further charges after cancellation</li>
                </ul>
              </div>

              {/* Chargeback Warning */}
              <div className="p-8 rounded-2xl border border-destructive/30 bg-destructive/5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                  <h2 className="text-2xl font-bold">Chargeback Warning</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Do not file a chargeback before contacting us or using the Whop Resolution Center.</strong>{" "}
                  Filing without prior contact is a breach of contract and considered fraudulent if services were delivered.
                </p>
                <p className="font-semibold text-sm mb-2">Consequences of improper chargebacks:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  {[
                    "Immediate termination of all services and portal access",
                    "Forfeiture of all deliverables",
                    "Account ban from all CodeCraft Agency and TechSci Inc. products",
                    "Collection action for original amount + chargeback fees ($15–$100) + legal costs",
                    "Possible legal action for breach of contract",
                    "Negative impact on credit/payment reputation (chargebacks tracked by payment networks)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 text-sm">
                  <p className="font-semibold mb-1">We resolve 95%+ of disputes directly.</p>
                  <p className="text-muted-foreground">
                    Resolution Center is faster (7 days vs. 60–90 days for chargebacks) and has no fees.
                    Always contact us first: <strong>hello@techsci.io</strong>
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="font-semibold mb-3">TechSci Inc. (d/b/a CodeCraft Agency)</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    Billing: <strong>billing@techsci.io</strong>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    Support: <strong>support@techsci.xyz</strong>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <strong>+1 (302) 314-6007</strong> · Mon–Fri, 9 AM–6 PM EST
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
