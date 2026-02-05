import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RotateCcw } from "lucide-react"
import { COMPANY_INFO } from "@/lib/constants"

export const metadata = {
  title: "Refund Policy | TechSci CodeCraft",
  description: "30-day money-back guarantee on all TechSci CodeCraft digital products.",
  openGraph: {
    title: "Refund Policy | TechSci CodeCraft",
    description: "30-day money-back guarantee on all TechSci CodeCraft digital products.",
    url: "https://codecraft.techsci.xyz/refund",
    type: "website",
    images: [{ url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: "TechSci CodeCraft" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/CODE_CRAFT_LOGO.png"],
  },
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
                  30-Day Money-Back
                </span>
                <br />
                <span className="bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                  Guarantee
                </span>
              </h1>
              <p className="text-muted-foreground">Last updated: February 2, 2026</p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Our Commitment to You</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At {COMPANY_INFO.legalName}, we stand behind the quality of our products. If you&apos;re not completely satisfied with your purchase, we offer a full refund within 30 days of your original purchase date - no questions asked.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To be eligible for a refund, you must meet the following criteria:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Request must be made within 30 days of purchase</li>
                  <li>• Applies to all one-time purchases and first-month subscriptions</li>
                  <li>• Account must be in good standing (no policy violations)</li>
                  <li>• Products must have been accessed through legitimate means</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">How to Request a Refund</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To request a refund, please follow these simple steps:
                </p>
                <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                  <li>Contact our support team at support@techsci.xyz</li>
                  <li>Include your order number and email address</li>
                  <li>Briefly explain your reason for the refund (optional)</li>
                  <li>We&apos;ll process your request within 2-3 business days</li>
                </ol>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Processing Time</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once your refund request is approved, we&apos;ll initiate the refund to your original payment method. Please allow 5-10 business days for the refund to appear in your account, depending on your bank or payment provider.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Subscription Cancellations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For subscription-based products, you can cancel at any time. If you cancel within the first 30 days, you&apos;ll receive a full refund. After 30 days, cancellation will prevent future charges, but no refund will be issued for the current billing period.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Exceptions</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The following situations are not eligible for refunds:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Requests made after the 30-day period</li>
                  <li>• Accounts terminated for policy violations</li>
                  <li>• Products obtained through unauthorized means</li>
                  <li>• Duplicate purchases (we&apos;ll help you with account recovery instead)</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Questions?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our refund policy, please don&apos;t hesitate to contact our support team at support@techsci.xyz. We&apos;re here to help!
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
