import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, AlertTriangle, CheckCircle2, XCircle, Mail, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | CodeCraft Agency (TechSci Inc.)",
  description: "Terms of Service for CodeCraft Agency digital marketing services and products.",
  openGraph: {
    title: "Terms of Service | CodeCraft Agency (TechSci Inc.)",
    description: "Terms of Service for CodeCraft Agency digital marketing services and products.",
    url: "https://codecraft.techsci.xyz/terms",
    type: "website",
    images: [{ url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: "TechSci CodeCraft" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/CODE_CRAFT_LOGO.png"] },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5 mb-6">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Legal</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Last updated: January 28, 2026 · TechSci Inc. (d/b/a CodeCraft Agency) · EIN: 35-2800827
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                By purchasing any product or service from CodeCraft Agency through Whop, you agree to these Terms.
              </p>
            </div>

            <div className="space-y-6">

              {/* 1. About */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">1. About CodeCraft Agency</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  TechSci Inc. (d/b/a CodeCraft Agency) provides B2B digital marketing consulting and
                  implementation services, including:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    "Fixed-scope marketing packages (strategy, content, SEO, paid ads)",
                    "Marketing analytics and reporting setup",
                    "Team training and knowledge transfer",
                    "Done-with-you implementation services",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  All services are delivered remotely via digital platforms (Whop, email, video calls, shared workspaces).
                </p>
              </div>

              {/* 2. Services */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">2. Services &amp; Deliverables</h2>
                <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                  Each product listing specifies the scope of work, deliverables, timeline, and access duration.
                  You are purchasing the deliverables and services described in your specific product. We work
                  with you to complete the scope within the stated timeline.
                </p>
                <p className="text-muted-foreground text-sm">
                  We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice.
                </p>
              </div>

              {/* 3. Service Period */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">3. Service Period &amp; Access</h2>
                <p className="text-muted-foreground text-sm mb-3">Per Whop&apos;s one-time payment policy:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• All active services are completed within 90 days of purchase</li>
                  <li>• Support obligations end 90 days after purchase</li>
                  <li>• Portal/content access continues for 12 months from purchase date</li>
                  <li>• After 12 months, access may be renewed or terminated at our discretion</li>
                  <li>• Subscription products (if offered) have separate terms</li>
                </ul>
              </div>

              {/* 4. Your Responsibilities */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">4. Your Responsibilities</h2>
                <p className="text-muted-foreground text-sm mb-3">To receive services, you must:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  {[
                    "Complete onboarding questionnaire within 5 business days",
                    "Attend kickoff call within 10 days of purchase",
                    "Provide required access (website, ad accounts, analytics, brand assets)",
                    "Respond to information requests within 3 business days",
                    "Attend scheduled review and training calls",
                    "Provide feedback on deliverables within 3 business days of receipt",
                    "Sign off on Phase 1 deliverables within 5 business days of delivery",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Delays caused by your non-response or failure to provide required materials are not
                    refundable. Failure to sign off on Phase 1 deliverables is considered acceptance after
                    5 business days.
                  </p>
                </div>
              </div>

              {/* 5. Pricing */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">5. Pricing &amp; Payment</h2>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• All prices are in USD unless stated otherwise</li>
                  <li>• Prices are exclusive of taxes; applicable taxes calculated at checkout</li>
                  <li>• Payment is processed by Whop&apos;s payment partners (Stripe, PayPal, or Whop as Merchant of Record)</li>
                  <li>• You are responsible for all payment method fees (e.g., international transaction fees)</li>
                  <li>• One-time payments are due in full at purchase unless an installment plan is selected</li>
                </ul>
              </div>

              {/* 6. Refund Policy */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">6. Refund &amp; Return Policy</h2>
                <p className="text-muted-foreground text-sm mb-3">
                  Refund requests must be submitted within <strong>30 days of purchase</strong> via the Whop
                  Resolution Center. Refunds are milestone-based — tied to deliverables completed, not time
                  elapsed. See our full{" "}
                  <a href="/refund" className="text-primary underline underline-offset-4">
                    Return &amp; Refund Policy
                  </a>{" "}
                  for complete details.
                </p>
                <p className="text-sm font-semibold mb-2">Non-refundable situations include:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    "Change of mind after kickoff call or Phase 1 delivery",
                    "Inability to implement deliverables on your end",
                    "External factors outside our control",
                    "Delays caused by your non-response or late materials",
                    "Dissatisfaction with results (we deliver services, not guaranteed outcomes)",
                    "Refund requests submitted after 30 days",
                    "Chargebacks filed without prior contact",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 7. Chargebacks */}
              <div className="p-8 rounded-2xl border border-destructive/30 bg-destructive/5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                  <h2 className="text-2xl font-bold">7. Chargebacks &amp; Disputes</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Filing a chargeback without first contacting us or using the Whop Resolution Center</strong>{" "}
                  may result in:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  {[
                    "Immediate termination of service and access",
                    "Loss of all deliverables",
                    "Collection action for owed amounts plus chargeback fees ($15–$100)",
                    "Legal action for breach of contract",
                    "Permanent ban from future purchases",
                    "Negative impact on your credit/payment reputation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  We vigorously dispute fraudulent chargebacks with full evidence (delivery receipts, customer
                  approvals, engagement logs, communication records).{" "}
                  <strong className="text-foreground">We resolve 95%+ of disputes directly.</strong> Always
                  use the Resolution Center first — it&apos;s faster, fair, and fee-free.
                </p>
              </div>

              {/* 8. IP */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">What You Own:</strong> All custom work created
                  specifically for your business (strategy documents, blog posts, graphics, ad copy) is yours
                  to use commercially.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">What We Own:</strong> Templates, frameworks, processes,
                  tools, and proprietary methods remain our intellectual property. You may not resell,
                  redistribute, or license these to third parties.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Third-Party Content:</strong> If we use stock photos,
                  icons, or licensed tools in your deliverables, you must comply with their licenses.
                </p>
              </div>

              {/* 9. Limitation */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  We provide services &quot;as-is&quot; without warranty of specific outcomes, ROI, sales, leads,
                  traffic, or rankings. Our total liability for any claim is limited to the amount you paid
                  for that product (not to exceed $1,799 for Growth Accelerator Package).
                </p>
                <p className="text-sm text-muted-foreground">
                  We are not liable for third-party platform changes (Google, Meta algorithm updates), your
                  implementation errors, client/customer behavior, or force majeure events.
                </p>
              </div>

              {/* 10. Limited Availability */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">10. Limited Availability</h2>
                <p className="text-sm text-muted-foreground">
                  Many services are limited to a specific number of clients per quarter to ensure quality.
                  Purchase does not guarantee a specific start date. We typically begin projects within 5–10
                  business days of purchase.
                </p>
              </div>

              {/* 11. Compliance */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">11. Compliance &amp; Legal</h2>
                <p className="text-sm text-muted-foreground mb-2">You agree to:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Use deliverables in compliance with all applicable laws (FTC, CAN-SPAM, GDPR, CCPA)</li>
                  <li>• Not use services for illegal, fraudulent, or prohibited purposes</li>
                  <li>• Comply with advertising platform policies (Meta Ads, Google Ads, LinkedIn)</li>
                  <li>• Provide accurate information — no impersonation, fake businesses, or misrepresentation</li>
                </ul>
              </div>

              {/* 12. Termination */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  We may terminate service and refund you (prorated for work completed) if you violate these
                  Terms, fail to respond for 30+ days, or engage in abusive behavior toward our team.
                </p>
                <p className="text-sm text-muted-foreground">
                  You may request cancellation at any time, but refunds are subject to our milestone-based
                  refund policy (Section 6).
                </p>
              </div>

              {/* 13. Modifications */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">13. Modifications</h2>
                <p className="text-sm text-muted-foreground">
                  We may update these Terms with 30 days&apos; advance notice via email or Whop announcement.
                  Continued use after notice constitutes acceptance. For active engagements, the Terms in
                  effect at the time of purchase govern that engagement.
                </p>
              </div>

              {/* 14. Governing Law */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">14. Governing Law &amp; Disputes</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  These Terms are governed by the laws of the United States and the State of Delaware.
                  Disputes are resolved in the following order:
                </p>
                <ol className="space-y-1.5 text-sm text-muted-foreground list-none">
                  {[
                    "Direct contact: hello@techsci.io (we respond within 24 hours on business days)",
                    "Whop Resolution Center (structured mediation)",
                    "Binding arbitration per Whop's Terms of Service (if unresolved)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  You agree to exhaust steps 1 and 2 before pursuing legal action.
                </p>
              </div>

              {/* 15. Entire Agreement */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">15. Entire Agreement</h2>
                <p className="text-sm text-muted-foreground">
                  These Terms, along with Whop&apos;s Buyer Terms and Seller Terms, constitute the entire
                  agreement between you and CodeCraft Agency. If any provision is found invalid or
                  unenforceable, the remaining provisions remain in full effect.
                </p>
              </div>

              {/* 16. Contact */}
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">16. Contact Us</h2>
                <p className="font-semibold mb-3">TechSci Inc. (d/b/a CodeCraft Agency)</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    Legal: <strong>legal@techsci.io</strong>
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
                <p className="text-xs text-muted-foreground mt-3">
                  651 N Broad St, Suite 201, Middletown, DE 19709, United States
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
